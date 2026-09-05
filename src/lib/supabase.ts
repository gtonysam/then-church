export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY
);

const sessionKey = "supabase_session";

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: any;
}

function headers(
  extraHeaders: Record<string, string> = {}
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    ...extraHeaders,
  };
}

/**
 * Sign in with Supabase Auth.
 */
export async function signIn(
  email: string,
  password: string
): Promise<Session> {
  if (!supabaseConfigured) {
    throw new Error(
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body?.error_description ||
        body?.msg ||
        "Invalid email or password."
    );
  }

  const sessionData: Session = {
    ...body,
    expires_at:
      Math.floor(Date.now() / 1000) +
      (body.expires_in || 3600),
  };

  localStorage.setItem(
    sessionKey,
    JSON.stringify(sessionData)
  );

  return sessionData;
}

/**
 * Get the current stored session.
 */
export function getSession(): Session | null {
  const raw = localStorage.getItem(sessionKey);

  if (!raw) {
    return null;
  }

  try {
    const session: Session = JSON.parse(raw);

    const now = Math.floor(Date.now() / 1000);

    if (
      !session.access_token ||
      (session.expires_at &&
        session.expires_at - now < 30)
    ) {
      signOut();
      return null;
    }

    return session;
  } catch {
    signOut();
    return null;
  }
}

export const getsession = getSession;

/**
 * Sign out.
 */
export function signOut() {
  localStorage.removeItem(sessionKey);
}

/**
 * Verify Supabase Auth user + active admin_users record.
 */
export async function verifyAdmin(
  accessToken: string
): Promise<boolean> {
  if (!supabaseConfigured || !accessToken) {
    return false;
  }

  try {
    const userRes = await fetch(
      `${SUPABASE_URL}/auth/v1/user`,
      {
        method: "GET",
        headers: headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      }
    );

    if (!userRes.ok) {
      const err = await userRes
        .json()
        .catch(() => ({}));

      if (
        err.code === "PGRST303" ||
        userRes.status === 401
      ) {
        signOut();

        throw new Error(
          "Session expired. Please sign in again."
        );
      }

      return false;
    }

    const userData = await userRes.json();

    if (!userData?.id) {
      return false;
    }

    const adminRes = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(
        userData.id
      )}&active=eq.true&select=user_id`,
      {
        method: "GET",
        headers: headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      }
    );

    if (!adminRes.ok) {
      const err = await adminRes
        .json()
        .catch(() => ({}));

      if (
        err.code === "PGRST303" ||
        adminRes.status === 401
      ) {
        signOut();

        throw new Error(
          "Session expired. Please sign in again."
        );
      }

      console.error(
        "Admin verification failed:",
        err
      );

      return false;
    }

    const admins = await adminRes.json();

    return (
      Array.isArray(admins) &&
      admins.length > 0
    );
  } catch (err: any) {
    if (err.message?.includes("expired")) {
      throw err;
    }

    console.error("verifyAdmin error:", err);

    return false;
  }
}

/**
 * Get the current authenticated user's
 * Authorization header.
 */
function authHeader(): Record<string, string> {
  const session = getSession();

  if (!session?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

/**
 * GET
 */
export async function get(path: string) {
  if (!supabaseConfigured) {
    return null;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
      method: "GET",
      headers: headers(authHeader()),
    }
  );

  if (!res.ok) {
    const body = await res
      .json()
      .catch(() => ({}));

    throw new Error(
      `GET ${path} failed: ${
        body?.message ||
        body?.details ||
        res.statusText
      }`
    );
  }

  return res.json();
}

/**
 * POST
 */
export async function post(
  path: string,
  body: any
) {
  if (!supabaseConfigured) {
    return null;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
      method: "POST",
      headers: headers({
        ...authHeader(),
        Prefer: "return=representation",
      }),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({}));

    throw new Error(
      `POST ${path} failed: ${
        errorBody?.message ||
        errorBody?.details ||
        res.statusText
      }`
    );
  }

  return res.json();
}

/**
 * PATCH
 */
export async function patch(
  path: string,
  body: any
) {
  if (!supabaseConfigured) {
    return null;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
      method: "PATCH",
      headers: headers({
        ...authHeader(),
        Prefer: "return=representation",
      }),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({}));

    console.error("PATCH error:", errorBody);

    throw new Error(
      `PATCH ${path} failed: ${
        errorBody?.message ||
        errorBody?.details ||
        res.statusText
      }`
    );
  }

  return res.json();
}

/**
 * DELETE
 *
 * Uses return=minimal because DELETE may not
 * return a JSON response body.
 */
export async function remove(path: string) {
  if (!supabaseConfigured) {
    return null;
  }

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
      method: "DELETE",
      headers: headers({
        ...authHeader(),
        Prefer: "return=minimal",
      }),
    }
  );

  if (!res.ok) {
    const errorBody = await res
      .json()
      .catch(() => ({}));

    throw new Error(
      `DELETE ${path} failed: ${
        errorBody?.message ||
        errorBody?.details ||
        res.statusText
      }`
    );
  }

  return true;
}

/**
 * Get the church associated with the currently
 * authenticated admin user.
 *
 * Relationship:
 *
 * Supabase Auth user
 *        ↓
 * admin_users.user_id
 *        ↓
 * admin_users.church_id
 *
 * No church ID is hardcoded here.
 */
export async function getCurrentChurchId(): Promise<number> {
  const session = getSession();

  if (!session?.access_token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  const userId = session.user?.id;

  if (!userId) {
    throw new Error(
      "Unable to determine the current user."
    );
  }

  const admins = await get(
    `admin_users?user_id=eq.${encodeURIComponent(
      userId
    )}&active=eq.true&select=church_id`
  );

  if (
    !Array.isArray(admins) ||
    admins.length === 0
  ) {
    throw new Error(
      "No active admin record was found for this user."
    );
  }

  const churchId = admins[0]?.church_id;

  if (
    churchId === null ||
    churchId === undefined
  ) {
    throw new Error(
      "Your admin account is not associated with a church."
    );
  }

  const numericChurchId = Number(churchId);

  if (!Number.isFinite(numericChurchId)) {
    throw new Error(
      "The church ID associated with your admin account is invalid."
    );
  }

  return numericChurchId;
}