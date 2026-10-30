import type { User } from "@/types/user";

const USERS_API = "https://jsonplaceholder.typicode.com/users";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  if (!isRecord(value) || !isRecord(value.address) || !isRecord(value.company)) {
    return false;
  }

  return (
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    typeof value.name === "string" &&
    typeof value.username === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.website === "string" &&
    typeof value.address.street === "string" &&
    typeof value.address.suite === "string" &&
    typeof value.address.city === "string" &&
    typeof value.address.zipcode === "string" &&
    typeof value.company.name === "string" &&
    typeof value.company.catchPhrase === "string" &&
    typeof value.company.bs === "string"
  );
}

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
  const response = await fetch(USERS_API, { signal });

  if (!response.ok) {
    throw new Error(`The user service returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new Error("The user service returned data in an unexpected format.");
  }

  return data;
}

export async function fetchUser(id: number): Promise<User | null> {
  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  const response = await fetch(`${USERS_API}/${id}`, { cache: "no-store" });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`The user service returned HTTP ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("The user service returned data in an unexpected format.");
  }

  return data;
}
