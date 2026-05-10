import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import crypto from "crypto";
import { usersTable } from "@workspace/db";
import {
  clearSession,
  getSessionId,
  createSession,
  SESSION_COOKIE,
  SESSION_TTL,
  type SessionData,
} from "../lib/auth";

const router: IRouter = Router();

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash) return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === verifyHash;
}

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/auth/user", (req: Request, res: Response) => {
  res.json({ user: req.isAuthenticated() ? req.user : null });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
       res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
       return;
    }
    const { email, password, firstName, lastName } = parsed.data;

    // Check if user exists
    const existing = await usersTable.findOne({ email });
    if (existing) {
       res.status(400).json({ error: "Email already in use" });
       return;
    }

    const hashedPassword = hashPassword(password);
    const user = await usersTable.create({
      email,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
      profileImageUrl: "",
    });

    const now = Math.floor(Date.now() / 1000);
    const sessionData: SessionData = {
      user: {
        id: user._id.toString(),
        email: user.email!,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        profileImageUrl: user.profileImageUrl || null,
      },
      access_token: "local_token",
      refresh_token: "local_refresh",
      expires_at: now + 30 * 24 * 60 * 60, // 30 days
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);
    
    res.json({ user: sessionData.user });
  } catch (err) {
    req.log.error(err, "Registration error");
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data" });
      return;
    }
    const { email, password } = parsed.data;

    const user = await usersTable.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const sessionData: SessionData = {
      user: {
        id: user._id.toString(),
        email: user.email!,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        profileImageUrl: user.profileImageUrl || null,
      },
      access_token: "local_token",
      refresh_token: "local_refresh",
      expires_at: now + 30 * 24 * 60 * 60,
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);
    
    res.json({ user: sessionData.user });
  } catch (err) {
    req.log.error(err, "Login error");
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/login", (_req: Request, res: Response) => {
  res.redirect("/login");
});

router.all("/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  if (sid) {
    await clearSession(res, sid);
  }
  
  if (req.method === "GET") {
    res.redirect("/");
  } else {
    res.json({ success: true });
  }
});

export default router;
