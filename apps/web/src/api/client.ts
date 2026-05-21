import type { DailyPlan, DiscoverResponse, DiscoveryFilters, PortfolioEntry } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || `Request failed for ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  health: () => request<{ ok: boolean; mode: "demo" | "github" }>("/api/health"),
  discover: (filters: DiscoveryFilters) =>
    request<DiscoverResponse>("/api/discover", {
      method: "POST",
      body: JSON.stringify(filters)
    }),
  getDailyPlan: () => request<DailyPlan>("/api/daily-plan"),
  getPortfolio: () => request<PortfolioEntry[]>("/api/portfolio"),
  createPortfolio: (entry: Partial<PortfolioEntry>) =>
    request<PortfolioEntry>("/api/portfolio", {
      method: "POST",
      body: JSON.stringify(entry)
    }),
  updatePortfolio: (id: string, entry: Partial<PortfolioEntry>) =>
    request<PortfolioEntry>(`/api/portfolio/${id}`, {
      method: "PATCH",
      body: JSON.stringify(entry)
    }),
  deletePortfolio: (id: string) =>
    request<void>(`/api/portfolio/${id}`, {
      method: "DELETE"
    }),
  createPlanningIssue: (title?: string, body?: string) =>
    request<{ created: boolean; message: string; issueUrl?: string }>("/api/create-planning-issue", {
      method: "POST",
      body: JSON.stringify({ title, body })
    })
};
