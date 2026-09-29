import React, { useState, useEffect } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Terminal, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: any) => void;
}

interface DiagnosticData {
  timestamp?: string;
  emailProvided?: string;
  configuredEmailMasked?: string;
  emailMatched?: boolean;
  passwordProvidedLength?: number;
  configuredPasswordLength?: number;
  passwordMatched?: boolean;
  authSource?: string;
  mongoStatus?: string;
  reason?: string;
}

interface ServerStatus {
  status: string;
  configuredAdminEmailMasked: string;
  configuredEmailDomain: string;
  hasConfiguredPassword: boolean;
  hasJwtSecret: boolean;
  mongoStatus: string;
  uptimeSeconds: number;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("avdhesh6968@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [checkingServer, setCheckingServer] = useState(false);

  // Fetch initial server environment diagnostic status on mount
  useEffect(() => {
    checkServerDiagnostics();
  }, []);

  const checkServerDiagnostics = async () => {
    setCheckingServer(true);
    try {
      console.log("[ADMIN-LOGIN] Checking server auth diagnostic endpoint /api/auth/diagnostic...");
      const res = await fetch("/api/auth/diagnostic");
      if (res.ok) {
        const data = await res.json();
        setServerStatus(data);
        console.log("[ADMIN-LOGIN] Server environment diagnostic:", data);
      } else {
        console.warn("[ADMIN-LOGIN] Diagnostic endpoint returned status:", res.status);
      }
    } catch (err: any) {
      console.error("[ADMIN-LOGIN] Failed to reach auth diagnostic endpoint:", err.message);
    } finally {
      setCheckingServer(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDiagnostic(null);
    setLoading(true);

    const submissionTime = new Date().toISOString();
    console.group(`[ADMIN-LOGIN ATTEMPT - ${submissionTime}]`);
    console.log("Endpoint: POST /api/auth/login");
    console.log("Target Email:", email.trim().toLowerCase());
    console.log("Password Length:", password.length);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      console.log("HTTP Response Status:", res.status);
      console.log("Server Payload:", data);

      if (!res.ok) {
        const diagnosticPayload = data.diagnostic || {
          timestamp: submissionTime,
          emailProvided: email,
          reason: data.error || "Authentication rejected by server.",
        };
        setDiagnostic(diagnosticPayload);
        setShowDiagnostics(true);

        const errorMsg = data.error || "Invalid credentials. Please check your email and password.";
        console.error(`[ADMIN-LOGIN FAILED]: ${errorMsg}`);
        console.table(diagnosticPayload);
        throw new Error(errorMsg);
      }

      console.log("✅ [ADMIN-LOGIN SUCCESSFUL]: JWT Token received, storing in localStorage.");
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("portfolio_admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.admin));
      onLoginSuccess(data.token, data.admin);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-[#FAF8F2] border-2 border-[#141413] rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0px_#141413]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#141413] text-[#D4F050] flex items-center justify-center border border-[#141413] shadow-[3px_3px_0px_#D4F050]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-[#141413]">Admin Portal</h1>
            <p className="font-mono text-xs text-[#6B6862]">Secure CMS & Portfolio Backend</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 font-mono text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-bold">{error}</p>
              {diagnostic?.reason && (
                <p className="mt-1 text-red-700 opacity-90">{diagnostic.reason}</p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#141413]">
                Admin Email
              </label>
              {serverStatus?.configuredAdminEmailMasked && (
                <span className="font-mono text-[10px] text-[#6B6862]">
                  Configured: {serverStatus.configuredAdminEmailMasked}
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 focus:border-[#141413] focus:outline-none font-sans text-sm text-[#141413]"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-mono text-xs uppercase tracking-wider text-[#141413]">
                Password
              </label>
              <span className="font-mono text-[10px] text-[#6B6862]">
                {password.length > 0 ? `${password.length} chars entered` : "from .env"}
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F5F2EA] border border-[#141413]/20 focus:border-[#141413] focus:outline-none font-sans text-sm text-[#141413]"
                placeholder="Enter admin password (e.g. Avdhesh@123)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-[#141413] text-[#F5F2EA] hover:bg-[#D4F050] hover:text-[#141413] border border-[#141413] font-mono text-xs uppercase tracking-wider font-bold transition-all duration-200 shadow-[4px_4px_0px_#141413] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating & Logging..." : "Sign In to CMS"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Detailed Diagnostics Section */}
        <div className="mt-6 pt-5 border-t border-[#141413]/10">
          <button
            type="button"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full flex items-center justify-between text-left font-mono text-xs text-[#6B6862] hover:text-[#141413] py-1 cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5 text-[#141413]" />
              Auth & Environment Diagnostics
            </span>
            {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDiagnostics && (
            <div className="mt-3 p-4 rounded-2xl bg-[#141413] text-[#F5F2EA] font-mono text-[11px] space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-white/60">Server Status:</span>
                <span className="flex items-center gap-1.5 text-[#D4F050]">
                  <CheckCircle2 className="w-3 h-3" />
                  {serverStatus ? "Online" : "Connecting..."}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-white/80">
                <div>
                  <span className="text-white/40 block">Configured Email:</span>
                  <span className="text-[#F5F2EA]">{serverStatus?.configuredAdminEmailMasked || "Loading..."}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Password Configured:</span>
                  <span className={serverStatus?.hasConfiguredPassword ? "text-emerald-400" : "text-amber-400"}>
                    {serverStatus?.hasConfiguredPassword ? "Yes (in .env)" : "Fallback Default"}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">MongoDB Status:</span>
                  <span className={serverStatus?.mongoStatus === "connected" ? "text-emerald-400" : "text-amber-300"}>
                    {serverStatus?.mongoStatus || "Checking..."}
                  </span>
                </div>
                <div>
                  <span className="text-white/40 block">JWT Secret:</span>
                  <span className="text-emerald-400">
                    {serverStatus?.hasJwtSecret ? "Configured" : "Active"}
                  </span>
                </div>
              </div>

              {diagnostic && (
                <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Last Attempt Analysis:
                  </div>
                  <div className="text-white/70">
                    • Email Match:{" "}
                    <span className={diagnostic.emailMatched ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {diagnostic.emailMatched ? "MATCH" : "MISMATCH"}
                    </span>
                  </div>
                  <div className="text-white/70">
                    • Password Match:{" "}
                    <span className={diagnostic.passwordMatched ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                      {diagnostic.passwordMatched ? "MATCH" : "MISMATCH"}
                    </span>
                  </div>
                  {diagnostic.passwordProvidedLength !== undefined && diagnostic.configuredPasswordLength !== undefined && (
                    <div className="text-white/70">
                      • Length: entered {diagnostic.passwordProvidedLength} chars vs expected {diagnostic.configuredPasswordLength} chars
                    </div>
                  )}
                  {diagnostic.reason && (
                    <div className="text-white/90 bg-white/5 p-2 rounded-lg mt-1 border border-white/10">
                      Reason: {diagnostic.reason}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                <span>Check browser Console (F12) for detailed logs</span>
                <button
                  type="button"
                  onClick={checkServerDiagnostics}
                  disabled={checkingServer}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[#D4F050]"
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${checkingServer ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-mono text-xs text-[#6B6862] hover:text-[#141413] transition-colors"
          >
            ← Back to Public Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

