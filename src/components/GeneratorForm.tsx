"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import { COMPANY_TYPES, CONTENT_TONE_OPTIONS } from "@/lib/prompts";
import toast from "react-hot-toast";

interface GeneratorFormProps {
  onSuccess?: (articles: any[]) => void;
}

export default function GeneratorForm({ onSuccess }: GeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "SaaS",
    keywords: [] as string[],
    keywordInput: "",
    tone: "professional" as "professional" | "casual" | "technical" | "friendly",
    numArticles: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numArticles" ? parseInt(value) : value,
    }));
  };

  const addKeyword = () => {
    const keyword = formData.keywordInput.trim();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword],
        keywordInput: "",
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      toast.error("El nombre de la empresa es requerido");
      return;
    }

    if (formData.keywords.length === 0) {
      toast.error("Debes agregar al menos una palabra clave");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          companyType: formData.companyType,
          keywords: formData.keywords,
          tone: formData.tone,
          numArticles: formData.numArticles,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "Error generando artículos");
        return;
      }

      toast.success(`${data.data.articles.length} artículo(s) generado(s)`);

      if (onSuccess) {
        onSuccess(data.data.articles);
      }

      setFormData({
        companyName: "",
        companyType: "SaaS",
        keywords: [],
        keywordInput: "",
        tone: "professional",
        numArticles: 1,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error generando artículos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Generar Artículos SEO</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre de la empresa"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Ej: Tech Solutions"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de empresa</label>
          <select
            name="companyType"
            value={formData.companyType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMPANY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Palabras clave</label>
          <div className="flex gap-2 mb-3">
            <Input
              value={formData.keywordInput}
              onChange={(e) => setFormData((prev) => ({ ...prev, keywordInput: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
              placeholder="Escribe una palabra clave y presiona Enter"
            />
            <Button type="button" variant="secondary" onClick={addKeyword} className="whitespace-nowrap">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {keyword}
                <button type="button" onClick={() => removeKeyword(index)} className="text-blue-600 hover:text-blue-800">×</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tono del contenido</label>
          <select
            name="tone"
            value={formData.tone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CONTENT_TONE_OPTIONS.map((tone) => (
              <option key={tone} value={tone}>{tone.charAt(0).toUpperCase() + tone.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de artículos (1-5)</label>
          <input
            type="number"
            name="numArticles"
            value={formData.numArticles}
            onChange={handleInputChange}
            min="1"
            max="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || formData.keywords.length === 0}
          className="w-full"
        >
          {isLoading ? "Generando..." : "Generar Artículos"}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Esto puede tomar 10-30 segundos por artículo
        </p>
      </form>
    </Card>
  );
}
