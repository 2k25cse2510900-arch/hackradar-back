const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const AUTH_TOKEN_STORAGE_KEY = "hackradar-auth-token";
export const AUTH_USER_STORAGE_KEY = "hackradar-auth-user";

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: Array<{ field?: string; message: string }>;
};

export type AuthUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  googleId?: string;
  authProvider?: "email" | "google";
  telegramChatId?: string | null;
  telegramVerified?: boolean;
  profile?: UserProfile;
};

export type UserProfile = {
  name: string;
  college: string;
  year: string;
  degree: string;
  domains: string[];
  skills: string[];
  experienceLevel: "Beginner" | "Intermediate" | "Advanced";
  goals: string[];
  preferredMode: string;
  availability: string;
  phoneNumber?: string;
};

export type Hackathon = {
  id: string;
  name: string;
  organizer: string;
  domain: string;
  mode: "Online" | "Offline" | "Hybrid";
  status: "Live" | "Upcoming" | "Ended";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  registration: "Free" | "Paid";
  deadline: string;
  registrationDeadline?: string | null;
  eventDates: string;
  location: string;
  prizePool: string;
  logo: string;
  officialWebsite: string;
  description: string;
  prizeBand: "High" | "Medium" | "Low";
};

export type Bookmark = {
  _id: string;
  hackathonId: string;
  hackathon?: Hackathon;
};

export type Alert = {
  _id: string;
  hackathonId: string;
  title: string;
  channels: string[];
  frequency: string;
  enabled: boolean;
  alertTime: string;
  lastTriggeredAt?: string | null;
  settings?: Record<string, unknown>;
};

function apiUrl(path: string) {
  return `${API_URL.replace(/\/$/, "")}${path}`;
}

export function getGoogleAuthUrl(nextPath?: string | null) {
  const url = new URL(apiUrl("/auth/google"));
  if (nextPath?.startsWith("/")) {
    url.searchParams.set("next", nextPath);
  }
  return url.toString();
}

export function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function getStoredAuthUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredAuthSession(token: string, user?: AuthUser) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  if (user) {
    window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  }
  window.dispatchEvent(new Event("hackradar-auth-updated"));
}

export function clearStoredAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.dispatchEvent(new Event("hackradar-auth-updated"));
}

export function getAuthUserDisplayName(user = getStoredAuthUser()) {
  if (!user) return "";

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return user.profile?.name || fullName || user.username || user.email || "";
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getStoredAuthToken();
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData) && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body?.data as T;
}

export async function register(payload: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  const data = await request<{ user: AuthUser; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setStoredAuthSession(data.token, data.user);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const data = await request<{ user: AuthUser; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setStoredAuthSession(data.token, data.user);
  return data;
}

export async function fetchCurrentUser(token = getStoredAuthToken()) {
  if (!token) return null;

  const data = await request<{ user: AuthUser }>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => null);

  if (!data?.user) {
    clearStoredAuthSession();
    return null;
  }

  setStoredAuthSession(token, data.user);
  return data.user;
}

export async function logout() {
  await request<null>("/auth/logout", { method: "POST" }).catch(() => null);
  clearStoredAuthSession();
}

export function listHackathons() {
  return request<{ hackathons: Hackathon[] }>("/hackathons").then((data) => data.hackathons);
}

export function getProfile() {
  return request<{ profile: UserProfile; telegram: { connected: boolean; verified: boolean } }>("/user/profile");
}

export function updateProfile(profile: Partial<UserProfile>) {
  return request<{ profile: UserProfile }>("/user/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export function requestTelegramVerificationCode() {
  return request<{ code: string; expires: string }>("/user/telegram/request-code", {
    method: "POST",
  });
}

export function listBookmarks() {
  return request<{ bookmarks: Bookmark[] }>("/bookmarks").then((data) => data.bookmarks);
}

export function createBookmark(hackathonId: string) {
  return request<{ bookmark: Bookmark }>("/bookmarks", {
    method: "POST",
    body: JSON.stringify({ hackathonId }),
  });
}

export function deleteBookmark(bookmarkId: string) {
  return request<null>(`/bookmarks/${bookmarkId}`, {
    method: "DELETE",
  });
}

export function listAlerts() {
  return request<Alert[]>("/alerts");
}

export function createAlert(payload: {
  hackathonId: string;
  title: string;
  channels: string[];
  frequency?: string;
  settings?: Record<string, unknown>;
}) {
  return request<Alert>("/alerts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteAlert(alertId: string) {
  return request<null>(`/alerts/${alertId}`, {
    method: "DELETE",
  });
}
