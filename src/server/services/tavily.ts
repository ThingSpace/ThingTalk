import fetch from 'node-fetch';

/**
 * Queries the Tavily web search API and returns a summarized string of results.
 * @param query The search query string.
 * @returns A string with summarized web search results, or an empty string on failure.
 */
export async function tavilyWebSearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return '';

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        max_results: 3,
        include_answer: true,
        include_raw_content: false,
      }),
    });
    if (!response.ok) return '';
    const data = await response.json();
    // Tavily returns an 'answer' field with a summary, and 'results' array with sources
    let summary = data.answer || '';
    if (data.results && Array.isArray(data.results)) {
      const sources = data.results.map((r: any) => `- ${r.title}: ${r.url}`).join('\n');
      if (sources) summary += `\nSources:\n${sources}`;
    }
    return summary.trim();
  } catch (err) {
    console.error('Tavily web search error:', err);
    return '';
  }
} 