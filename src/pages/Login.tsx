import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    // Simulate slight async delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const result = login(username.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Resource Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials hint */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Super Admin</span>
              <span>super / super</span>
              <span className="font-medium">PMO</span>
              <span>pmo / pmo</span>
              <span className="font-medium">Resource Manager</span>
              <span>resm / resm</span>
              <span className="font-medium">Resource</span>
              <span>reso / reso</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
