import Link from "next/link";
import type { User } from "@/types/user";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

type UserCardProps = {
  user: User;
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link
      aria-label={`View ${user.name}'s profile`}
      className="user-card"
      href={`/users/${user.id}`}
    >
      <div className="card-top">
        <div className={`avatar avatar-card avatar-${(user.id - 1) % 6}`} aria-hidden="true">
          {initials(user.name)}
        </div>
        <span className="card-arrow" aria-hidden="true">
          <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </span>
      </div>
      <h3 className="card-name">{user.name}</h3>
      <p className="card-username">@{user.username}</p>
      <div className="card-meta">
        <svg aria-hidden="true" className="meta-icon" fill="none" height="15" viewBox="0 0 20 20" width="15">
          <rect height="13" rx="2.2" stroke="currentColor" strokeWidth="1.4" width="16" x="2" y="3.5" />
          <path d="m3 5 7 5.2L17 5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.4" />
        </svg>
        <span>{user.email}</span>
      </div>
      <div className="card-meta">
        <svg aria-hidden="true" className="meta-icon" fill="none" height="15" viewBox="0 0 20 20" width="15">
          <path
            d="M10 18s6-5.3 6-10A6 6 0 1 0 4 8c0 4.7 6 10 6 10Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span>{user.address.city}</span>
        <span aria-hidden="true">·</span>
        <span>{user.company.name}</span>
      </div>
    </Link>
  );
}
