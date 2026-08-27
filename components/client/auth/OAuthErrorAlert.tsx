const oauthErrorMessages: Record<string, string> = {
  google_auth_failed:
    "Google sign-in was not completed. Please try again or use email and password.",
  invalid_oauth_state:
    "Your Google sign-in session is invalid or has expired. Please try again.",
};

interface OAuthErrorAlertProps {
  code?: string;
}

export default function OAuthErrorAlert({ code }: OAuthErrorAlertProps) {
  if (!code) return null;

  const message =
    oauthErrorMessages[code] ??
    "Unable to sign in with Google. Please try again.";

  return (
    <div
      role="alert"
      className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}
