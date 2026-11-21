import { authClient } from "@/lib/auth-client";

export const API_BASE_URL =
  typeof window !== "undefined"
    ? ""
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getAuthHeaders(isJson = true): Promise<HeadersInit> {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const tokenRes = await (authClient as unknown as {
      token?: () => Promise<{ data?: { token?: string } }>;
    }).token?.();

    const jwt = tokenRes?.data?.token;
    if (jwt) {
      headers["Authorization"] = `Bearer ${jwt}`;
      return headers;
    }
  } catch {
    // Fallback to session/localStorage token if token plugin call fails
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("token");
    if (stored) {
      headers["Authorization"] = `Bearer ${stored}`;
    }
  }

  return headers;
}