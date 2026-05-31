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
      {/* Background character art */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img
          src="/rias.png"
          alt=""
          className="absolute right-0 bottom-0 h-[80vh] object-contain object-bottom opacity-15"
        />
        <img
          src="/haruna.png"
          alt=""
          className="absolute left-0 bottom-0 h-[60vh] object-contain object-bottom opacity-10"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(0,90%,55%,0.05)_0%,_transparent_70%)]" />
      </div>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="font-mono font-bold tracking-tight text-2xl text-primary">DARK_ALLIANCE</span>
          </div>
        </div>

        <Card className="bg-card/90 border-border/50 shadow-xl shadow-primary/10 backdrop-blur">
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
                    className="pl-9 font-mono bg-background focus-visible:ring-primary"
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
                className="w-full font-mono font-bold tracking-tight bg-primary text-primary-foreground hover:bg-primary/85"
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
