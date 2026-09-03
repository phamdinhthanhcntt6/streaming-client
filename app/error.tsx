"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-[#ebeef0] px-4">
      <div
        role="alert"
        className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm"
      >
        <h1 className="text-2xl font-bold text-slate-800">
          Something went wrong
        </h1>
        <p className="mt-2 text-slate-500">
          We could not display this page. Please try again.
        </p>
        <Button type="button" onClick={retry} className="mt-6 bg-[#01579B]">
          Try again
        </Button>
      </div>
    </main>
  );
}
