import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  try {
    const res = await fetch(
      'https://api.github.com/users/ankursingh4u/repos?per_page=50&sort=pushed',
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return NextResponse.json([])

    const repos = await res.json()

    const filtered = repos
      .filter((r: { fork: boolean; name: string }) => !r.fork && r.name !== 'Portfolio')
      .map((r: {
        name: string
        description: string | null
        language: string | null
        stargazers_count: number
        pushed_at: string
        html_url: string
        topics: string[]
      }) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushed_at: r.pushed_at,
        html_url: r.html_url,
        topics: r.topics,
      }))
      .slice(0, 12)

    return NextResponse.json(filtered)
  } catch {
    return NextResponse.json([])
  }
}
