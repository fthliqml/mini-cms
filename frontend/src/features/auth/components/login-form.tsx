"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../api/login";
import { useAuthSession } from "../hooks/use-auth-session";
import {
  loginSchema,
  type LoginFormValues,
} from "../schemas/login-schema";

export function LoginForm() {
  const router = useRouter();
  const { startSession } = useAuthSession();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await loginUser(values);

      if (!response.status) {
        setServerError(
          response.message ||
            "Sign in failed. Please check your credentials.",
        );
        return;
      }

      startSession(response.data);

      if (response.data.role === "admin") {
        router.push("/dashboard/admin/posts");
      } else {
        router.push("/dashboard/author/posts");
      }

      router.refresh();
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "An error occurred during sign in. Please try again.",
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Mini CMS</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to manage content
          </p>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-xl font-bold">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-xs">
              Enter your registered email and password
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError ? (
                <div className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email
                </Label>
                <div className="relative flex h-9 items-center">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    className="pl-9"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                {errors.email ? (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative flex h-9 items-center">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    {...register("password")}
                    aria-invalid={Boolean(errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="mt-2 w-full font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col border-t pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
