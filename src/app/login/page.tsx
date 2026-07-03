import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/ui/fade-in";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12 selection:bg-primary/30">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
        <div className="absolute -top-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/4 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <StaggerContainer>
          <StaggerItem>
            <div className="mb-10 text-center flex flex-col items-center">
              <BrandLogo
                size={56}
                imageClassName="h-14 w-14 border border-white/10 rounded-2xl shadow-glow"
                textClassName="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent/80"
                stacked
              />
              <h1 className="mt-4 text-3xl font-black tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                Masuk
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant/80">
                Sistem Generator Buletin SabatFlow
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <Card className="border-white/10 bg-surface-dim/40 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8">
                <Suspense>
                  <LoginForm />
                </Suspense>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </main>
  );
}
