"use client";

import Link from "next/link";

export default function UserProfileError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="profile-error">
      <span className="eyebrow">Something went wrong</span>
      <h1 className="section-title">We couldn&apos;t load this profile.</h1>
      <p className="state-description">
        The user service may be temporarily unavailable. Please try again.
      </p>
      <button className="action-button" onClick={reset} type="button">
        Try again
      </button>
      <Link className="back-link" href="/">
        Back to the directory
      </Link>
    </main>
  );
}
