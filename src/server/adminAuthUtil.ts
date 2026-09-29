import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "./models";
import { generateToken } from "./auth";
import { isMongoDBConnected } from "./db";

export interface AuthDiagnostic {
  timestamp: string;
  emailProvided: string;
  configuredEmailMasked: string;
  emailMatched: boolean;
  passwordProvidedLength: number;
  configuredPasswordLength: number;
  passwordMatched: boolean;
  authSource: "environment" | "database" | "none";
  mongoStatus: "connected" | "disconnected";
  reason: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  admin?: {
    name: string;
    email: string;
    role: string;
    id: string;
  };
  error?: string;
  diagnostic: AuthDiagnostic;
}

/**
 * Sanitizes an environment variable value by trimming whitespace and
 * removing surrounding single or double quotes if present.
 */
function cleanEnvValue(val?: string, fallback: string = ""): string {
  if (!val) return fallback;
  let cleaned = val.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned || fallback;
}

/**
 * Masks an email for safe diagnostic output (e.g. avd***@gmail.com).
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [user, domain] = email.split("@");
  if (user.length <= 3) return `${user[0]}***@${domain}`;
  return `${user.substring(0, 3)}***@${domain}`;
}

/**
 * Retrieves the normalized admin credentials from environment variables.
 */
export function getAdminEnvCredentials() {
  const email = cleanEnvValue(process.env.ADMIN_EMAIL, "avdhesh6968@gmail.com").toLowerCase();
  const password = cleanEnvValue(process.env.ADMIN_PASSWORD, "Avdhesh@123");
  return { email, password };
}

/**
 * Timing-safe string comparison to prevent timing side-channel attacks.
 */
function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return a === b;
  }
}

/**
 * Securely authenticates admin credentials using environment variables
 * with automatic database synchronization and fallback resilience.
 */
export async function authenticateAdmin(
  rawEmail: string,
  rawPassword: string
): Promise<AuthResult> {
  const timestamp = new Date().toISOString();
  const email = (rawEmail || "").trim().toLowerCase();
  const password = (rawPassword || "").trim();

  const { email: envEmail, password: envPassword } = getAdminEnvCredentials();
  const configuredEmailMasked = maskEmail(envEmail);
  const mongoStatus = isMongoDBConnected() ? "connected" : "disconnected";

  console.log(`[AUTH-DIAGNOSTIC ${timestamp}] Login attempt for: ${email}`);
  console.log(`[AUTH-DIAGNOSTIC ${timestamp}] Configured Admin Email: ${configuredEmailMasked} (length: ${envEmail.length})`);
  console.log(`[AUTH-DIAGNOSTIC ${timestamp}] MongoDB Status: ${mongoStatus}`);

  const emailMatchesEnv = safeEqual(email, envEmail);
  const passwordMatchesEnv = safeEqual(password, envPassword);

  // Strategy 1: Environment-Variable Based Authentication (Primary & Resilient)
  if (emailMatchesEnv && passwordMatchesEnv) {
    console.log(`[AUTH-DIAGNOSTIC ${timestamp}] ✅ Environment credentials matched successfully.`);

    // If MongoDB is available, sync the user to database asynchronously
    let dbUserId = "env_admin";
    if (isMongoDBConnected()) {
      try {
        let dbUser = await User.findOne({ email });
        const hashedPassword = await bcrypt.hash(envPassword, 10);
        if (!dbUser) {
          dbUser = await User.create({
            name: "Avdhesh Kumar",
            email,
            password: hashedPassword,
            role: "admin",
          });
          console.log(`[AUTH-DIAGNOSTIC ${timestamp}] 👤 Created admin record in MongoDB.`);
        } else {
          dbUser.password = hashedPassword;
          await dbUser.save();
          console.log(`[AUTH-DIAGNOSTIC ${timestamp}] 🔄 Synchronized admin password in MongoDB.`);
        }
        dbUserId = dbUser._id.toString();
      } catch (dbErr) {
        console.warn(`[AUTH-DIAGNOSTIC ${timestamp}] Notice: MongoDB sync skipped (${dbErr}). Proceeding with env auth.`);
      }
    }

    const admin = {
      id: dbUserId,
      name: "Avdhesh Kumar",
      email,
      role: "admin",
    };

    const token = generateToken(admin);

    return {
      success: true,
      token,
      admin,
      diagnostic: {
        timestamp,
        emailProvided: email,
        configuredEmailMasked,
        emailMatched: true,
        passwordProvidedLength: password.length,
        configuredPasswordLength: envPassword.length,
        passwordMatched: true,
        authSource: "environment",
        mongoStatus,
        reason: "Credentials verified directly against environment configuration.",
      },
    };
  }

  // Strategy 2: Check MongoDB Database (in case password was updated in DB directly)
  if (isMongoDBConnected()) {
    try {
      const dbUser = await User.findOne({ email });
      if (dbUser && dbUser.password) {
        const isDbPasswordMatch = await bcrypt.compare(password, dbUser.password);
        if (isDbPasswordMatch) {
          console.log(`[AUTH-DIAGNOSTIC ${timestamp}] ✅ Database credentials matched successfully.`);
          const admin = {
            id: dbUser._id.toString(),
            name: dbUser.name || "Avdhesh Kumar",
            email: dbUser.email,
            role: dbUser.role || "admin",
          };
          const token = generateToken(admin);
          return {
            success: true,
            token,
            admin,
            diagnostic: {
              timestamp,
              emailProvided: email,
              configuredEmailMasked,
              emailMatched: true,
              passwordProvidedLength: password.length,
              configuredPasswordLength: envPassword.length,
              passwordMatched: true,
              authSource: "database",
              mongoStatus,
              reason: "Credentials verified against MongoDB User store.",
            },
          };
        }
      }
    } catch (err: any) {
      console.warn(`[AUTH-DIAGNOSTIC ${timestamp}] Database check error: ${err.message}`);
    }
  }

  // Determine specific failure reason for diagnostics
  let reason = "Invalid credentials.";
  if (!emailMatchesEnv) {
    reason = `Email mismatch: provided '${email}' does not match configured admin email.`;
    console.warn(`[AUTH-DIAGNOSTIC ${timestamp}] ❌ ${reason}`);
  } else if (!passwordMatchesEnv) {
    reason = `Password mismatch: entered length (${password.length}) vs configured length (${envPassword.length}).`;
    console.warn(`[AUTH-DIAGNOSTIC ${timestamp}] ❌ ${reason}`);
  }

  return {
    success: false,
    error: "Invalid email or password.",
    diagnostic: {
      timestamp,
      emailProvided: email,
      configuredEmailMasked,
      emailMatched: emailMatchesEnv,
      passwordProvidedLength: password.length,
      configuredPasswordLength: envPassword.length,
      passwordMatched: false,
      authSource: "none",
      mongoStatus,
      reason,
    },
  };
}
