import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Zap } from "lucide-react";

function LoginGraphic() {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="lglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        <filter id="lblur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <circle cx="200" cy="200" r="180" fill="url(#lglow)" filter="url(#lblur)" />
      {/* Dashed rings — each spins at different speed */}
      {[
        { r: 60,  dur: '20s', rev: false, delay: '0s' },
        { r: 90,  dur: '30s', rev: true,  delay: '-5s' },
        { r: 120, dur: '40s', rev: false, delay: '-10s' },
        { r: 150, dur: '55s', rev: true,  delay: '-15s' },
      ].map(({ r, dur, rev, delay }) => (
        <circle
          key={r}
          cx="200" cy="200" r={r}
          stroke="#dc2626" strokeOpacity="0.25" strokeWidth="1"
          fill="none" strokeDasharray="8 6"
          className={rev ? 'anim-orbit-rev' : 'anim-orbit'}
          style={{ transformOrigin: '200px 200px', animationDuration: dur, animationDelay: delay }}
        />
      ))}
      {/* Orbit nodes */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const x = 200 + Math.cos(a) * 140;
        const y = 200 + Math.sin(a) * 140;
        return (
          <circle
            key={i} cx={x} cy={y} r="3"
            fill="#ef4444" fillOpacity="0.6"
            className="anim-twinkle"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        );
      })}
      {/* Central hex */}
      <polygon
        points="200,120 240,143 240,188 200,210 160,188 160,143"
        stroke="#dc2626" strokeOpacity="0.4" strokeWidth="1.5"
        fill="#dc2626" fillOpacity="0.04"
        className="anim-orbit"
        style={{ transformOrigin: '200px 165px', animationDuration: '30s' }}
      />
      {/* Core orb */}
      <circle
        cx="200" cy="165" r="22"
        stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6"
        fill="#ef4444" fillOpacity="0.08"
        className="anim-pulse-ring"
        style={{ transformOrigin: '200px 165px' }}
      />
      <circle
        cx="200" cy="165" r="9"
        fill="#ef4444" fillOpacity="0.9"
        className="anim-pulse-glow"
        style={{ transformOrigin: '200px 165px' }}
      />
    </svg>
  );
}

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    login.mutate(
      { data: { password } },
      {
        onSuccess: (result) => {
          if (result.success) {
            queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
            toast({ title: "AUTHENTICATED", description: "Access granted to admin panel." });
            setLocation("/admin/dashboard");
          } else {
            toast({ title: "ACCESS DENIED", description: "Invalid password.", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "ERROR", description: "Authentication failed.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <LoginGraphic />

      <div className="anim-fade-up w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="anim-fade-up delay-100 flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="font-mono font-bold tracking-tight text-2xl text-primary">DARK_ALLIANCE</span>
          </div>
        </div>

        <Card className="anim-fade-up delay-200 bg-card/90 border-border/50 shadow-xl shadow-primary/10 backdrop-blur">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold font-mono tracking-tight">OWNER_LOGIN</CardTitle>
            <CardDescription className="font-mono text-xs">Enter credentials to access the admin panel</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-xs">PASSWORD</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    data-testid="input-password"
                    className="pl-9 font-mono bg-background focus-visible:ring-primary transition-shadow duration-200"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                data-testid="button-login"
                className="w-full font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/85 btn-press"
                disabled={login.isPending || !password}
              >
                {login.isPending ? "AUTHENTICATING..." : "LOGIN"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
