import { NextResponse } from 'next/server'

export const revalidate = 3600

const ACCOUNTS = ['ankursingh4u', 'ankur4work']

interface GithubRepo {
  fork: boolean
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  pushed_at: string
  html_url: string
  topics: string[]
  owner: { login: string }
}

async function fetchRepos(username: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=50&sort=pushed`,
    {
      headers: { Accept: 'application/vnd.github.v3+json' },
      next: { revalidate: 3600 },
    }
  )
  if (!res.ok) return []
  return res.json()
}

export async function GET() {
  try {
    const [repos1, repos2] = await Promise.all(ACCOUNTS.map(fetchRepos))
    const allRepos = [...repos1, ...repos2]

    const seen = new Set<string>()
    const filtered = allRepos
      .filter((r) => {
        if (r.fork) return false
        if (r.name === 'Portfolio') return false
        const key = r.name.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
      .slice(0, 12)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushed_at: r.pushed_at,
        html_url: r.html_url,
        topics: r.topics,
        account: r.owner?.login ?? '',
      }))

    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json([])
  }
}
