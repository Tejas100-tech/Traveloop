import { Router, type IRouter, type Request, type Response } from "express";
import { usersTable, tripsTable } from "@workspace/db";
import { clearSession, getSessionId } from "../lib/auth";
import crypto from "crypto";

const router: IRouter = Router();

// PATCH /users/me — update profile
router.patch("/users/me", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { firstName, lastName, profileImageUrl } = req.body as {
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };

  const updates: any = {};
  if (typeof firstName === "string") updates.firstName = firstName.trim() || null;
  if (typeof lastName === "string") updates.lastName = lastName.trim() || null;
  if (typeof profileImageUrl === "string") updates.profileImageUrl = profileImageUrl || null;

  const updated = await usersTable.findOneAndUpdate(
    { _id: req.user.id },
    { $set: updates },
    { new: true }
  ).lean();

  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    id: updated._id.toString(),
    email: updated.email ?? null,
    firstName: updated.firstName ?? null,
    lastName: updated.lastName ?? null,
    profileImageUrl: updated.profileImageUrl ?? null,
  });
});

// DELETE /users/me — delete account + all data
router.delete("/users/me", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userId = req.user.id;

  await tripsTable.deleteMany({ userId });
  await usersTable.deleteOne({ _id: userId });

  const sid = getSessionId(req);
  await clearSession(res, sid);

  res.sendStatus(204);
});

// POST /users/me/photo — upload to Cloudinary via server-side signed upload
router.post("/users/me/photo", async (req: Request, res: Response): Promise<void> => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(503).json({ error: "Photo upload is not configured" });
    return;
  }

  const { dataUrl } = req.body as { dataUrl?: string };
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    res.status(400).json({ error: "dataUrl is required and must be an image" });
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "traveloop/profiles";
  const publicId = `user_${req.user.id}`;

  const sigString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha256").update(sigString).digest("hex");

  const formData = new URLSearchParams();
  formData.set("file", dataUrl);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("signature", signature);
  formData.set("folder", folder);
  formData.set("public_id", publicId);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    req.log.error({ err }, "Cloudinary upload failed");
    res.status(500).json({ error: "Upload failed" });
    return;
  }

  const data = (await uploadRes.json()) as { secure_url: string };
  const url = data.secure_url;

  // Save to user record
  await usersTable.updateOne(
    { _id: req.user.id },
    { $set: { profileImageUrl: url } }
  );

  res.json({ url });
});

export default router;
