"use client";

import { FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login, register } from "@/services/authService";
import { getToken, setToken } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type FormErrors = {
  email?: string;
  password?: string;
};

const validateForm = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormErrors, boolean>>({
    email: false,
    password: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      mode === "register"
        ? register({ email, password })
        : login({ email, password }),
    onSuccess: (data) => {
      setToken(data.token);
      router.replace("/");
    },
  });

  useEffect(() => {
    if (getToken()) {
      router.replace("/");
      return;
    }

    const checkTimer = window.setTimeout(() => setIsChecking(false), 0);
    return () => window.clearTimeout(checkTimer);
  }, [router]);

  if (isChecking) {
    return <main className="auth-loading" aria-busy="true" />;
  }

  const isRegister = mode === "register";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm(email, password);
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    mutation.mutate();
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setErrors((current) => ({ ...current, email: undefined }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors((current) => ({ ...current, password: undefined }));
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? "Create your account to manage your tasks."
            : "Sign in to continue to your tasks."}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => handleEmailChange(event.target.value)}
              onBlur={() => {
                setTouched((current) => ({ ...current, email: true }));
                setErrors((current) => ({
                  ...current,
                  email: validateForm(email, password).email,
                }));
              }}
              placeholder="you@example.com"
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {touched.email && errors.email && (
              <span className="field-error" id="email-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              onBlur={() => {
                setTouched((current) => ({ ...current, password: true }));
                setErrors((current) => ({
                  ...current,
                  password: validateForm(email, password).password,
                }));
              }}
              placeholder="••••••••"
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {touched.password && errors.password && (
              <span className="field-error" id="password-error">
                {errors.password}
              </span>
            )}
          </div>

          {mutation.isError && (
            <p className="error-message">
              {getApiErrorMessage(
                mutation.error,
                "Unable to sign in. Please try again.",
              )}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Loading..."
              : isRegister
                ? "Create account"
                : "Login"}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => router.push(isRegister ? "/login" : "/register")}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </section>
    </main>
  );
}
