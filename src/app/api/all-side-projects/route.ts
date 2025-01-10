import { NextResponse } from "next/server";
import octokit from "@/lib/octokit";

export async function GET() {
  try {
    // Search for trending repositories with the 'side-project' topic
    const { data } = await octokit.search.repos({
      q: "topic:side-project sort:stars-desc",
      per_page: 10, // Limiting to 50 repositories for better performance
    });

    // Extract repositories from search results
    const repositories = data.items.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      language: repo.language,
      owner: {
        login: repo.owner?.login || "",
        avatar_url: repo.owner?.avatar_url || "",
      },
      topics: repo.topics,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));

    return NextResponse.json(repositories);
  } catch (error) {
    console.error("Error fetching trending side projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}