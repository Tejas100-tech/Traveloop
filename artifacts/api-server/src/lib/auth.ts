import * as client from "openid-client";
import crypto from "crypto";
import { type Request, type Response } from "express";
import { sessionsTable } from "@workspace/db";

export const ISSUER_URL = process.env.ISSUER_URL ?? "https://replit.com/oidc";
export const SESSION_COOKIE = "sid";
export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  user: any;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

let oidcConfig: client.Configuration | null = null;

export async function getOidcConfig(): Promise<client.Configuration> {
  if (!oidcConfig) {
    oidcConfig = await client.discovery(
      new URL(ISSUER_URL),
      process.env.REPL_ID!,
    );
  }
  return oidcConfig;
}

export async function createSession(data: SessionData): Promise<string> {
  const sid = crypto.randomBytes(32).toString("hex");
  await sessionsTable.create({
    sid,
    sess: data as any,
    expire: new Date(Date.now() + SESSION_TTL),
  });
  return sid;
}

export async function getSession(sid: string): Promise<SessionData | null> {
  const row = await sessionsTable.findOne({ sid }).lean();

  if (!row || row.expire < new Date()) {
    if (row) await deleteSession(sid);
    return null;
  }

  return row.sess as unknown as SessionData;
}

export async function updateSession(
  sid: string,
  data: SessionData,
): Promise<void> {
  await sessionsTable.updateOne(
    { sid },
    { $set: { sess: data as any, expire: new Date(Date.now() + SESSION_TTL) } }
  );
}

export async function deleteSession(sid: string): Promise<void> {
  await sessionsTable.deleteOne({ sid });
}

export async function clearSession(
  res: Response,
  sid?: string,
): Promise<void> {
  if (sid) await deleteSession(sid);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function getSessionId(req: Request): string | undefined {
  const authHeader = req.headers["authorization"];
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies?.[SESSION_COOKIE];
}
