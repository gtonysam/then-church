import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { getSession, signIn, supabaseConfigured, verifyAdmin } from "@/lib/supabase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // If a valid non-expired session exists, redirect straight to admin dashboard
  if (getSession()) {
    return <Navigate to="/admin" replace />;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      // 1. Authenticate user
      const session = await signIn(email, password);

      if (!session?.access_token) {
        throw new Error("Failed to retrieve session token. Please try again.");
      }

      // 2. Check admin authorization
      const ok = await verifyAdmin(session.access_token);
      if (!ok) {
        throw new Error("This account is not authorized as a church administrator.");
      }

      // 3. Navigate upon success
      navigate("/admin", { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-warm border border-border p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
            <LockKeyhole className="text-gold" />
          </div>
          <h1 className="font-display text-3xl font-bold">Church Admin</h1>
          <p className="text-muted-foreground mt-2">Manage your church website</p>
        </div>

        {!supabaseConfigured && (
          <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
            Supabase is not configured. Add <code>VITE_SUPABASE_URL</code> and{" "}
            <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              disabled={!supabaseConfigured || busy}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full border rounded-lg px-4 py-3 bg-background"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              disabled={!supabaseConfigured || busy}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="w-full border rounded-lg px-4 py-3 bg-background"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!supabaseConfigured || busy}
            className="w-full rounded-full bg-gold py-3 font-bold disabled:opacity-50 transition-opacity"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <a
          href="/"
          className="block text-center text-sm text-muted-foreground mt-6 hover:text-gold transition-colors"
        >
          ← Back to website
        </a>
      </div>
    </div>
  );
}