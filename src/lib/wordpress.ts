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
  excerpt?: string;
  featured_media?: number;
}

export interface WPConnectionResult {
  success: boolean;
  error?: string;
}

const WP_TIMEOUT_MS = 10_000;

function wpFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, { ...options, signal: AbortSignal.timeout(WP_TIMEOUT_MS) });
}

async function getAuthHeader(config: WordPressConfig): Promise<string> {
  return "Basic " + Buffer.from(`${config.username}:${config.password}`).toString("base64");
}

/**
 * Tests the WordPress REST API connection with detailed error reporting.
 * Uses /wp-json/wp/v2/users/me which requires valid auth — avoids accepting 400 as success.
 */
export async function testWordPressConnection(config: WordPressConfig): Promise<WPConnectionResult> {
  const base = config.url.replace(/\/$/, "");

  // First verify the site is a WordPress installation
  let discoveryOk = false;
  try {
    const res = await wpFetch(`${base}/wp-json/`);
    discoveryOk = res.status === 200;
  } catch {
    return { success: false, error: "No se puede conectar a ese dominio. Verifica la URL y que WordPress esté activo." };
  }

  if (!discoveryOk) {
    return { success: false, error: "La URL no parece un sitio WordPress válido. Asegúrate de que /wp-json/ esté disponible." };
  }

  // Validate credentials using the authenticated /users/me endpoint
  try {
    const auth = await getAuthHeader(config);
    const res = await wpFetch(`${base}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: auth },
    });

    if (res.status === 200) return { success: true };
    if (res.status === 401) return { success: false, error: "Credenciales incorrectas. Usa una contraseña de aplicación de WordPress, no tu contraseña de acceso." };
    if (res.status === 403) return { success: false, error: "El usuario no tiene permisos para publicar. Asegúrate de usar un usuario con rol Editor o superior." };

    return { success: false, error: `Respuesta inesperada del servidor WordPress (HTTP ${res.status}).` };
  } catch {
    return { success: false, error: "Timeout al verificar credenciales. El servidor WordPress no responde." };
  }
}

export async function publishPostToWordPress(
  config: WordPressConfig,
  post: WordPressPost
): Promise<{ success: boolean; postId?: number; postUrl?: string; error?: string }> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");

    const payload: Record<string, unknown> = {
      title: post.title,
      content: post.content,
      status: post.status || "draft",
      categories: post.categories ?? [],
      tags: post.tags ?? [],
    };

    if (post.excerpt) payload.excerpt = post.excerpt;

    const response = await wpFetch(`${url}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = "Error creando post en WordPress";
      try {
        const errorData = await response.json();
        if (errorData.message) errorMsg = errorData.message;
        if (response.status === 401) errorMsg = "Credenciales de WordPress inválidas o expiradas";
        if (response.status === 403) errorMsg = "Sin permisos para publicar posts en WordPress";
      } catch {}
      return { success: false, error: errorMsg };
    }

    const data = (await response.json()) as { id: number; link: string };
    return { success: true, postId: data.id, postUrl: data.link };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return { success: false, error: msg.includes("AbortError") ? "Timeout: WordPress no respondió a tiempo" : msg };
  }
}

/**
 * Creates a new WordPress tag by name if it doesn't exist, returns its ID.
 * This allows users to publish with new tags without pre-creating them.
 */
export async function ensureWordPressTags(
  config: WordPressConfig,
  tagNames: string[]
): Promise<number[]> {
  if (tagNames.length === 0) return [];

  const auth = await getAuthHeader(config);
  const url = config.url.replace(/\/$/, "");
  const ids: number[] = [];

  for (const name of tagNames) {
    try {
      // Try to create — WP returns existing tag ID on duplicate
      const res = await wpFetch(`${url}/wp-json/wp/v2/tags`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.status === 201) {
        const data = await res.json() as { id: number };
        ids.push(data.id);
      } else if (res.status === 400) {
        // Tag might already exist — search for it
        const searchRes = await wpFetch(`${url}/wp-json/wp/v2/tags?search=${encodeURIComponent(name)}&per_page=1`, {
          headers: { Authorization: auth },
        });
        if (searchRes.ok) {
          const results = await searchRes.json() as { id: number; name: string }[];
          const match = results.find((t) => t.name.toLowerCase() === name.toLowerCase());
          if (match) ids.push(match.id);
        }
      }
    } catch {
      // Skip tag if request fails — don't block publication
    }
  }

  return ids;
}

export async function getWordPressCategories(
  config: WordPressConfig
): Promise<{ id: number; name: string }[]> {
  try {
    const auth = await getAuthHeader(config);
    const url = config.url.replace(/\/$/, "");
    const response = await wpFetch(`${url}/wp-json/wp/v2/categories?per_page=100`, {
      headers: { Authorization: auth },
    });
    if (!response.ok) return [];
    const categories = await response.json();
    return categories.map((cat: { id: number; name: string }) => ({ id: cat.id, name: cat.name }));
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
    const response = await wpFetch(`${url}/wp-json/wp/v2/tags?per_page=100`, {
      headers: { Authorization: auth },
    });
    if (!response.ok) return [];
    const tags = await response.json();
    return tags.map((tag: { id: number; name: string }) => ({ id: tag.id, name: tag.name }));
  } catch {
    return [];
  }
}
