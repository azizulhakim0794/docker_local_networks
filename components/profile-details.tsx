import type { ReactNode } from "react";
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

function Detail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="detail-item">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{children}</div>
    </div>
  );
}

export default function ProfileDetails({ user }: { user: User }) {
  return (
    <article aria-labelledby="profile-name" className="profile-card">
      <div aria-hidden="true" className="profile-cover" />
      <div className="profile-heading">
        <div
          aria-hidden="true"
          className={`avatar avatar-profile avatar-${(user.id - 1) % 6}`}
        >
          {initials(user.name)}
        </div>
        <div>
          <h1 className="profile-name" id="profile-name">
            {user.name}
          </h1>
          <p className="profile-username">@{user.username}</p>
        </div>
      </div>

      <div className="profile-body">
        <h2 className="profile-about">A little about {user.name.split(" ")[0]}</h2>
        <div className="detail-grid">
          <Detail label="Email">
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </Detail>
          <Detail label="Phone">
            <a href={`tel:${user.phone.replace(/[^\d+]/g, "")}`}>{user.phone}</a>
          </Detail>
          <Detail label="Website">
            <a href={`https://${user.website}`} rel="noreferrer" target="_blank">
              {user.website}
            </a>
          </Detail>
          <Detail label="Address">
            {user.address.street}, {user.address.suite}
            <br />
            {user.address.city}, {user.address.zipcode}
          </Detail>
          <Detail label="Company">{user.company.name}</Detail>
          <Detail label="Company catchphrase">{user.company.catchPhrase}</Detail>
        </div>
      </div>
    </article>
  );
}
