import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  testWordPressConnection,
  publishPostToWordPress,
  getWordPressCategories,
  getWordPressTags,
} from "@/lib/wordpress";

const mockConfig = {
  url: "https://misitio.com",
  username: "admin",
  password: "pass123",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("testWordPressConnection", () => {
  it("debe retornar true si la API responde 200", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 200 })
    );
    const result = await testWordPressConnection(mockConfig);
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://misitio.com/wp-json/wp/v2/posts?per_page=1",
      expect.objectContaining({ method: "GET" })
    );
  });

  it("debe retornar true si la API responde 400", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 400 })
    );
    const result = await testWordPressConnection(mockConfig);
    expect(result).toBe(true);
  });

  it("debe retornar false si la API responde 401", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 401 })
    );
    const result = await testWordPressConnection(mockConfig);
    expect(result).toBe(false);
  });

  it("debe retornar false si hay error de red", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
    const result = await testWordPressConnection(mockConfig);
    expect(result).toBe(false);
  });

  it("debe manejar URLs con slash al final", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 200 })
    );
    await testWordPressConnection({ ...mockConfig, url: "https://misitio.com/" });
    expect(fetch).toHaveBeenCalledWith(
      "https://misitio.com/wp-json/wp/v2/posts?per_page=1",
      expect.anything()
    );
  });
});

describe("publishPostToWordPress", () => {
  const mockPost = {
    title: "Mi Artículo",
    content: "<p>Contenido</p>",
    status: "draft" as const,
  };

  it("debe publicar exitosamente y retornar postId y postUrl", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 123, link: "https://misitio.com/?p=123" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await publishPostToWordPress(mockConfig, mockPost);
    expect(result.success).toBe(true);
    expect(result.postId).toBe(123);
    expect(result.postUrl).toBe("https://misitio.com/?p=123");
    expect(fetch).toHaveBeenCalledWith(
      "https://misitio.com/wp-json/wp/v2/posts",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Mi Artículo"),
      })
    );
  });

  it("debe incluir categorías y tags en el payload", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1, link: "https://misitio.com/?p=1" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    await publishPostToWordPress(mockConfig, {
      ...mockPost,
      categories: [5, 10],
      tags: [3, 7],
    });
    const callBody = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(callBody.categories).toEqual([5, 10]);
    expect(callBody.tags).toEqual([3, 7]);
  });

  it("debe publicar como publish cuando se especifica", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1, link: "" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    );
    await publishPostToWordPress(mockConfig, {
      ...mockPost,
      status: "publish",
    });
    const callBody = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(callBody.status).toBe("publish");
  });

  it("debe retornar error si WordPress devuelve error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "REST API disabled" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await publishPostToWordPress(mockConfig, mockPost);
    expect(result.success).toBe(false);
    expect(result.error).toBe("REST API disabled");
  });

  it("debe retornar error si hay error de conexión", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Connection refused"));
    const result = await publishPostToWordPress(mockConfig, mockPost);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Connection refused");
  });
});

describe("getWordPressCategories", () => {
  it("debe retornar lista de categorías", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([
        { id: 1, name: "SEO" },
        { id: 2, name: "Marketing" },
      ]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await getWordPressCategories(mockConfig);
    expect(result).toEqual([
      { id: 1, name: "SEO" },
      { id: 2, name: "Marketing" },
    ]);
  });

  it("debe retornar array vacío si la API falla", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 })
    );
    const result = await getWordPressCategories(mockConfig);
    expect(result).toEqual([]);
  });

  it("debe retornar array vacío si hay error de red", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Timeout"));
    const result = await getWordPressCategories(mockConfig);
    expect(result).toEqual([]);
  });
});

describe("getWordPressTags", () => {
  it("debe retornar lista de tags", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify([
        { id: 10, name: "javascript" },
        { id: 20, name: "tutorial" },
      ]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    const result = await getWordPressTags(mockConfig);
    expect(result).toEqual([
      { id: 10, name: "javascript" },
      { id: 20, name: "tutorial" },
    ]);
  });

  it("debe retornar array vacío si falla", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Error"));
    const result = await getWordPressTags(mockConfig);
    expect(result).toEqual([]);
  });
});
