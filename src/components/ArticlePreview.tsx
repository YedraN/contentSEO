"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { classNames } from "@/lib/utils";

interface ArticlePreviewProps {
  article: {
    id: string;
    title: string;
    content: string;
    keywords: string[];
    metaDescription?: string;
    readingTime?: number;
  };
}

export default function ArticlePreview({ article }: ArticlePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [format, setFormat] = useState<"markdown" | "html" | "docx">("markdown");
  const [wpConnected, setWpConnected] = useState(false);
  const [showWpModal, setShowWpModal] = useState(false);
  const [wpStatus, setWpStatus] = useState("draft");
  const [isPublishing, setIsPublishing] = useState(false);

  const [localTitle, setLocalTitle] = useState(article.title);
  const [localContent, setLocalContent] = useState(article.content);
  const [editTitle, setEditTitle] = useState(article.title);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.innerHTML = localContent;
      contentRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    fetch("/api/wordpress/credentials")
      .then((r) => r.json())
      .then((d) => setWpConnected(d.data?.connected ?? false))
      .catch(() => {});
  }, []);

  const handleEdit = () => {
    setEditTitle(localTitle);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    const newContent = contentRef.current?.innerHTML ?? localContent;
    if (!editTitle.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, content: newContent }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Error guardando cambios");
        return;
      }
      setLocalTitle(editTitle);
      setLocalContent(newContent);
      setIsEditing(false);
      toast.success("Cambios guardados");
    } catch {
      toast.error("Error guardando cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/articles/download/${article.id}?format=${format}`);
      if (!response.ok) {
        toast.error("Error descargando artículo");
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ext = format === "docx" ? "docx" : format === "html" ? "html" : "md";
      const filename = `${localTitle.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}.${ext}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Artículo descargado");
    } catch {
      toast.error("Error descargando artículo");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePublishToWordPress = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/publish-to-wordpress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: wpStatus, categories: [], tags: [] }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Publicado en WordPress");
        setShowWpModal(false);
      } else {
        toast.error(data.error || "Error publicando en WordPress");
      }
    } catch {
      toast.error("Error publicando en WordPress");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up overflow-hidden">
      <div className="p-6">
        {/* Title */}
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full text-xl font-bold text-gray-900 border-2 border-brand-300 rounded-xl px-3 py-2 mb-4 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-500 transition-all"
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-snug">{localTitle}</h2>
            {article.metaDescription && (
              <p className="text-gray-500 italic mb-4 border-l-4 border-brand-500 pl-4 text-sm">
                {article.metaDescription}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              {article.keywords?.map((keyword) => (
                <span key={keyword} className="bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                  {keyword}
                </span>
              ))}
            </div>
            {article.readingTime && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readingTime} minutos de lectura
              </div>
            )}
          </>
        )}

        {/* Edit mode: contentEditable */}
        {isEditing && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contenido</p>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="prose prose-sm max-w-none border-2 border-brand-200 focus:outline-none focus:border-brand-400 bg-gray-50 rounded-xl p-5 min-h-[300px] cursor-text transition-colors"
            />
            <p className="text-xs text-gray-400 mt-2">Haz clic en cualquier parte del texto para editarlo directamente</p>
          </div>
        )}

        {/* Display mode: preview toggle */}
        {!isEditing && showContent && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div
              className="prose prose-sm max-w-none bg-gray-50 border border-gray-100 rounded-xl p-5 max-h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: localContent }}
            />
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-6 pb-6">
        {isEditing ? (
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} isLoading={isSaving} className="flex-1">
              Guardar cambios
            </Button>
            <Button variant="secondary" onClick={handleCancelEdit} disabled={isSaving} className="flex-1">
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Formato
              </label>
              <div className="flex gap-1.5">
                {(["markdown", "html", "docx"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={classNames(
                      "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                      format === f
                        ? "bg-brand-600 text-white shadow-sm"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    {f === "markdown" ? ".md" : f === "html" ? ".html" : ".docx"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button onClick={handleDownload} isLoading={isDownloading}>
                Descargar
              </Button>
              <Button variant="secondary" onClick={() => setShowContent(!showContent)}>
                {showContent ? "Ocultar" : "Vista previa"}
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                Editar
              </Button>
              {wpConnected && (
                <Button variant="ghost" onClick={() => setShowWpModal(true)}>
                  WordPress
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* WordPress Modal */}
      {showWpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Publicar en WordPress</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado del post</label>
                <select
                  value={wpStatus}
                  onChange={(e) => setWpStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:border-brand-500 focus:ring-brand-100 transition-all"
                >
                  <option value="draft">Borrador</option>
                  <option value="publish">Publicado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePublishToWordPress}
                isLoading={isPublishing}
                className="flex-1"
              >
                {isPublishing ? "Publicando..." : "Publicar"}
              </Button>
              <Button variant="secondary" onClick={() => setShowWpModal(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
