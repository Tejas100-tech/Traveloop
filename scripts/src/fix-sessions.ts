import { sessionsTable } from "@workspace/db";

/**
 * Repairs the `sessions` collection.
 *
 * Older builds of this app stored sessions under a `sessionId` field, which left a
 * unique `sessionId_1` index on the collection. The current schema stores sessions
 * under `sid`, so every insert writes `sessionId: null` and the stale unique index
 * rejects all but the first row (E11000 duplicate key ... sessionId: null).
 *
 * This script drops that stale index, removes unusable session rows, and makes sure
 * the indexes the current schema expects exist.
 */
const STALE_INDEX = "sessionId_1";

async function main() {
  // Importing @workspace/db opens the connection (MONGO_URI, or an in-memory server).
  await sessionsTable.db.asPromise();

  const collection = sessionsTable.collection;

  const before = await collection.indexes();
  console.log(
    `Existing sessions indexes: ${before.map((i) => i.name).join(", ") || "(none)"}`,
  );

  if (before.some((i) => i.name === STALE_INDEX)) {
    await collection.dropIndex(STALE_INDEX);
    console.log(`Dropped stale index: ${STALE_INDEX}`);
  } else {
    console.log(`No stale index "${STALE_INDEX}" found.`);
  }

  // Remove session rows that cannot be used (missing/blank sid) so the unique index builds.
  const removed = await collection.deleteMany({
    $or: [{ sid: { $exists: false } }, { sid: null }, { sid: "" }],
  });
  if (removed.deletedCount) {
    console.log(`Removed ${removed.deletedCount} unusable session row(s).`);
  }

  await sessionsTable.syncIndexes();

  const after = await collection.indexes();
  console.log(
    `Final sessions indexes: ${after
      .map((i) => `${i.name}${i.unique ? " (unique)" : ""}`)
      .join(", ")}`,
  );

  await sessionsTable.db.close();
  console.log("Done. Registration and login should work now.");
}

main().catch(async (err) => {
  console.error("Failed to fix sessions:", err?.message ?? err);
  await sessionsTable.db.close().catch(() => {});
  process.exit(1);
});
