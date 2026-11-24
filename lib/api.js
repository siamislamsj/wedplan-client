import { authClient } from "./auth-client";

const BASE = process.env.NEXT_PUBLIC_API_URL;
let cache = { token: null, at: 0 };

export const resetToken = () => (cache = { token: null, at: 0 });

async function getToken(force) {
  if (!force && cache.token && Date.now() - cache.at < 8 * 60 * 1000) return cache.token;
  const session = await authClient.getSession();
  let token = session?.data?.token;
  if (!token) token = (await authClient.token())?.data?.token;
  cache = { token: token || null, at: Date.now() };
  return cache.token;
}

export async function api(path, { method = "GET", body, auth = true } = {}, retry = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = await getToken(!retry);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }
  if (res.status === 401 && auth && retry) return api(path, { method, body, auth }, false);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.message || "Request failed"), { status: res.status, code: json.code });
  return json;
}
