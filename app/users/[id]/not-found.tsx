import Link from "next/link";

export default function UserNotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">Profile not found</span>
      <h1 className="directory-heading">That person isn&apos;t here.</h1>
      <p className="directory-description">
        This profile may have moved, or the user ID may not be valid.
      </p>
      <Link className="action-button" href="/">
        Back to the directory
      </Link>
    </main>
  );
}
