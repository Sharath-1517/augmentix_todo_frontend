export async function fetchData({
  endpoint,
  data,
  method,
}: {
  data?: unknown;
  endpoint: string;
  method: "POST" | "GET" | "PUT";
}) {
  if (method == "GET") {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      method,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
  }

  return await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
  });
}
