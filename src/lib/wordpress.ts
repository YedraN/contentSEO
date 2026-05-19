export interface WordPressConfig {
  url: string;
  username: string;
  password: string;
}

export interface WordPressPost {
  id?: number;
  title: string;
  content: string;
  status: "draft" | "publish" | "pending" | "private";
  categories?: number[];
  tags?: number[];
  featured_media?: number;
}

async function getAuthHeader(config: WordPressConfig): Promise<string> {
  const credentials = `${config.username}:${config.password}`;
  return "Basic " + Buffer.from(credentials).toString("base64");
}

export async function testWordPressConnection(config: WordPressConfig): Promise<boolean> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");
    const response = await fetch(`${url}/wp-json/wp/v2/posts?per_page=1`, {
      method: "GET",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });
    return response.status === 200 || response.status === 400;
  } catch {
    return false;
  }
}

export async function publishPostToWordPress(
  config: WordPressConfig,
  post: WordPressPost
): Promise<{ success: boolean; postId?: number; postUrl?: string; error?: string }> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");

    const payload = {
      title: post.title,
      content: post.content,
      status: post.status || "draft",
      categories: post.categories || [],
      tags: post.tags || [],
    };

    const response = await fetch(`${url}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Error creando post en WordPress",
      };
    }

    const data = (await response.json()) as { id: number; link: string };

    return {
      success: true,
      postId: data.id,
      postUrl: data.link,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function getWordPressCategories(
  config: WordPressConfig
): Promise<{ id: number; name: string }[]> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");

    const response = await fetch(`${url}/wp-json/wp/v2/categories?per_page=100`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) return [];

    const categories = await response.json();
    return categories.map((cat: { id: number; name: string }) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch {
    return [];
  }
}

export async function getWordPressTags(
  config: WordPressConfig
): Promise<{ id: number; name: string }[]> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");

    const response = await fetch(`${url}/wp-json/wp/v2/tags?per_page=100`, {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) return [];

    const tags = await response.json();
    return tags.map((tag: { id: number; name: string }) => ({
      id: tag.id,
      name: tag.name,
    }));
  } catch {
    return [];
  }
}
