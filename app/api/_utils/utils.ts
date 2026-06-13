export function logErrorResponse(error: unknown) {
  console.error("API error:", error);

  if (typeof error === "object" && error !== null && "response" in error) {
    // @ts-ignore
    console.error("Response data:", error.response?.data);
  }
}

