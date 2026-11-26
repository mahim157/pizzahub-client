import { createAuthClient } from "better-auth/react";
import {
  jwtClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        businessName: {
          type: "string",
          required: false,
        },
      },
    }),

    jwtClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

export async function getAuthToken(): Promise<string | null> {
  try {
    const response = await authClient.token();

    if (response.error || !response.data?.token) {
      return null;
    }

    return response.data.token;
  } catch (error) {
    console.error("Failed to get authentication token:", error);
    return null;
  }
}
