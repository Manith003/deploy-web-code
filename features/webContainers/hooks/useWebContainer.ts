import { useState, useEffect, useCallback, useRef } from "react";
import { WebContainer } from "@webcontainer/api";
import { TemplateFolder } from "@/features/playground/types";

// GLOBAL SINGLETONS
let webContainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;
let globalServerUrl: string | null = null;

interface UseWebContainerProps {
  templateData: TemplateFolder | null;
}

export const useWebContainer = ({ templateData }: UseWebContainerProps) => {
  const [serverUrl, setServerUrl] = useState<string | null>(globalServerUrl);
  const [isLoading, setIsLoading] = useState<boolean>(!webContainerInstance);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(
    webContainerInstance
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function init() {
      try {
        // Already booted — sync state immediately
        if (webContainerInstance) {
          setInstance(webContainerInstance);
          setServerUrl(globalServerUrl);
          setIsLoading(false);
          return;
        }

        if (!bootPromise) {
          bootPromise = WebContainer.boot();
        }

        const booted = await bootPromise;
        webContainerInstance = booted;

        // Update BOTH global AND React state directly in the event
        booted.on("server-ready", (port, url) => {
          console.log("server-ready:", url);
          globalServerUrl = url;
          if (mountedRef.current) {
            setServerUrl(url);
          }
        });

        if (mountedRef.current) {
          setInstance(booted);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("WebContainer boot failed:", err);
        bootPromise = null;
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      }
    }

    init();

    // // If the container was already running when this hook mounted, sync the URL once
    // if (globalServerUrl && !serverUrl) {
    //   setServerUrl(globalServerUrl);
    // }

    return () => {
      mountedRef.current = false;
      // Intentionally NOT tearing down the container on unmount
    };
  }, []); // Empty dependency array — run once only

  const writeFileSync = useCallback(async (path: string, content: string) => {
    if (!webContainerInstance) {
      console.warn("writeFileSync called but WebContainer is not ready");
      return;
    }
    try {
      const parts = path.split("/");
      const folderPath = parts.slice(0, -1).join("/");
      if (folderPath) {
        await webContainerInstance.fs.mkdir(folderPath, { recursive: true });
      }
      await webContainerInstance.fs.writeFile(path, content);
    } catch (e) {
      console.error("writeFileSync failed:", e);
      throw e; // Re-throw so handleSave in page.tsx can catch it
    }
  }, []);

  return { serverUrl, isLoading, error, instance, writeFileSync };
};