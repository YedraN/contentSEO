"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticlePreview from "@/components/ArticlePreview";
import toast from "react-hot-toast";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.id}`);
        if (!res.ok) {
          toast.error("Artículo no encontrado");
          router.push("/history");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setArticle(data.data);
        } else {
          toast.error("Error cargando artículo");
          router.push("/history");
        }
      } catch {
        toast.error("Error cargando artículo");
        router.push("/history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-gray-500">Artículo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ArticlePreview article={article} />
      </div>
    </div>
  );
}
