"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchUsers } from "@/lib/users";
import type { User } from "@/types/user";
import SearchInput from "@/components/search-input";
import UserCard from "@/components/user-card";

function readableError(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export default function UserDirectory() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setStatus("loading");

      try {
        const result = await fetchUsers(controller.signal);
        setUsers(result);
        setStatus("ready");
      } catch (error) {
        if (!controller.signal.aborted) {
          setErrorMessage(readableError(error));
          setStatus("error");
        }
      }
    }

    void loadUsers();
    return () => controller.abort();
  }, [attempt]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredUsers = users.filter((user) =>
    [
      user.name,
      user.username,
      user.email,
      user.company.name,
    ].some((field) => field.toLocaleLowerCase().includes(normalizedQuery)),
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link aria-label="Commonplace home" className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <svg fill="none" height="21" viewBox="0 0 24 24" width="21">
              <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M3.5 19v-1.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V19m1.3-12.8a3 3 0 0 1 0 5.7m1 1.5a4.2 4.2 0 0 1 3.7 4.2V19"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          Commonplace
        </Link>
        <span className="topbar-note">A little more connected</span>
      </header>

      <main className="directory-main">
        <div className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          Your community, at a glance
        </div>
        <h1 className="directory-heading">
          Good people make
          <br />
          <span className="heading-accent">good things happen.</span>
        </h1>
        <p className="directory-description">
          Meet the people behind the names. Explore their work, find a familiar
          face, or discover someone new.
        </p>

        <section aria-labelledby="directory-title">
          <div className="directory-tools">
            <div>
              <h2 className="section-title" id="directory-title">
                The directory
              </h2>
              <p aria-live="polite" className="results-count">
                {status === "ready"
                  ? `${filteredUsers.length} ${filteredUsers.length === 1 ? "person" : "people"}${query ? " found" : " in your community"}`
                  : "A good place to start"}
              </p>
            </div>
            <SearchInput onChange={setQuery} value={query} />
          </div>

          {status === "loading" && (
            <div aria-label="Loading people" className="user-grid" role="status">
              {Array.from({ length: 6 }, (_, index) => (
                <div aria-hidden="true" className="skeleton-card" key={index} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="state-panel" role="alert">
              <span className="state-icon" aria-hidden="true">
                <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
                  <path
                    d="M12 8v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
              <h3 className="state-title">We couldn&apos;t load the directory</h3>
              <p className="state-description">{errorMessage}</p>
              <button
                className="action-button"
                onClick={() => setAttempt((current) => current + 1)}
                type="button"
              >
                Try again
              </button>
            </div>
          )}

          {status === "ready" && filteredUsers.length > 0 && (
            <div className="user-grid">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}

          {status === "ready" && filteredUsers.length === 0 && (
            <div className="state-panel">
              <span className="state-icon" aria-hidden="true">
                <svg fill="none" height="22" viewBox="0 0 24 24" width="22">
                  <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
                </svg>
              </span>
              <h3 className="state-title">No people found</h3>
              <p className="state-description">
                We couldn&apos;t find anyone matching “{query}”. Try a different
                name, username, email, or company.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Made for getting to know each other · Demo profiles from JSONPlaceholder
      </footer>
    </div>
  );
}
