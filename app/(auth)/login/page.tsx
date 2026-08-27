import GoogleOAuthButton from "@/components/client/auth/GoogleOAuthButton";
import LoginForm from "@/components/client/auth/login/LoginForm";
import OAuthErrorAlert from "@/components/client/auth/OAuthErrorAlert";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Login | Streaming App",
  description: "Log in to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const errorParam = (await searchParams).error;
  const oauthError = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo & Header */}
      <div className="flex flex-col items-center space-y-4 text-center mb-8">
        <Logo />

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Dont have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-gray-900 hover:underline"
            >
              Start for free
            </Link>
          </p>
        </div>
      </div>

      <OAuthErrorAlert code={oauthError} />

      {/* Social Login */}
      <div className="flex gap-4 mb-6">
        <GoogleOAuthButton label="Log in with Google" />
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 border-gray-200"
        >
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 border-gray-200"
        >
          <svg
            className="w-5 h-5 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.78 1.44.02 2.62.63 3.35 1.7-2.9 1.76-2.42 5.53.53 6.72-.73 1.83-1.68 3.55-2.69 4.53zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500 lowercase">or</span>
        </div>
      </div>

      {/* Form (Client Component) */}
      <LoginForm />
    </div>
  );
}
