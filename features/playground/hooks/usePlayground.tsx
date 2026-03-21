import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById, SaveUpdatedCode } from "../actions";

interface PlaygroundData {
  id: string;
  title?: string;
  [key: string]: any;
}

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
    null
  );
  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizeTemplate = (input: any): TemplateFolder => {
    return {
      folderName: input?.folderName || "Root",
      items: Array.isArray(input?.items) ? input.items : [],
    };
  };

  const loadPlayground = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getPlaygroundById(id);
      //@ts-expect-error-ignore
      setPlaygroundData(data);

      const rawContent = data?.templateFiles?.[0]?.content;

      // 1️⃣ From DB (string)
      if (typeof rawContent === "string") {
        const parsed = JSON.parse(rawContent);
        setTemplateData(normalizeTemplate(parsed));
        toast.success("Playground loaded successfully");
        return;
      }

      // 2️⃣ From API
      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) throw new Error("Failed to fetch template");

      const templateRes = await res.json();
      setTemplateData(normalizeTemplate(templateRes.templateJson));

      toast.success("Template loaded successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to load playground data");
      toast.error("Failed to load playground data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(
    async (data: TemplateFolder) => {
      try {
        await SaveUpdatedCode(id, data);
        setTemplateData(data);
        toast.success("Template saved successfully");
      } catch (error) {
        console.error("Error saving template data:", error);
        toast.error("Failed to save changes");
        throw error;
      }
    },
    [id]
  );

  // load playground on first render or id change
  useEffect(() => {
    loadPlayground();
  }, [loadPlayground]);

  return {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  };
};
