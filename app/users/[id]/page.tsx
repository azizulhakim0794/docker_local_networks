import Link from "next/link";
import { notFound } from "next/navigation";
import ProfileDetails from "@/components/profile-details";
import { fetchUser } from "@/lib/users";

export default async function UserProfilePage({
  params,
}: PageProps<"/users/[id]">) {
  const { id } = await params;

  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const user = await fetchUser(Number(id));

  if (!user) {
    notFound();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link aria-label="Commonplace home" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
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
      <main className="profile-main">
        <Link className="back-link" href="/">
          <svg fill="none" height="17" viewBox="0 0 20 20" width="17">
            <path
              d="M15.8 10H4.2m0 0 5-5m-5 5 5 5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
          </svg>
          Back to the directory
        </Link>
        <ProfileDetails user={user} />
      </main>
      <footer className="footer">
        Made for getting to know each other · Demo profiles from JSONPlaceholder
      </footer>
    </div>
  );
}
