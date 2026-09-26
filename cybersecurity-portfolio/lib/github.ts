/**
 * Optional GitHub enrichment — server-side only, cached, fail-soft.
 * - No token? Returns null and the UI renders static content. Zero external calls.
 * - Token set? Fetches with a short timeout, caches 1h, never throws to callers.
 * - Tokens never leave the server (no NEXT_PUBLIC_ prefix anywhere).
 */

export interface GithubRepoSummary {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  updatedAt: string;
  stars: number;
}

const cache = new Map<string, { at: number; data: GithubRepoSummary[] }>();
const TTL_MS = 60 * 60 * 1000;

export async function getPinnedRepos(username: string): Promise<GithubRepoSummary[] | null> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token || !username) return null;

  const hit = cache.get(username);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=6&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'raphael-portfolio',
        },
        signal: ctrl.signal,
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Array<{
      name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      updated_at: string;
      stargazers_count: number;
      fork: boolean;
    }>;
    const data: GithubRepoSummary[] = json
      .filter((r) => !r.fork)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        language: r.language,
        updatedAt: r.updated_at,
        stars: r.stargazers_count,
      }));
    cache.set(username, { at: Date.now(), data });
    return data;
  } catch {
    return null; // fail soft — static content remains
  } finally {
    clearTimeout(timer);
  }
}
