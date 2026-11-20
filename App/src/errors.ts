import { ConvexError } from "convex/values";

// Turns anything thrown by a Convex mutation into a message for the user.
// `fallback` is shown when the error carries no readable message.
export function errorMessage(caught: unknown, fallback: string): string {
  if (caught instanceof ConvexError) {
    return typeof caught.data === "string" ? caught.data : fallback;
  }
  if (caught instanceof Error && caught.message.trim() !== "") {
    return caught.message;
  }
  return fallback;
}
