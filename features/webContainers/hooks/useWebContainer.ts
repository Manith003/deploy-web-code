// import { useState, useEffect, useCallback } from "react";
// import { WebContainer } from "@webcontainer/api";
// import { TemplateFolder } from "@/features/playground/lib/path-to-json";

// // =========================================================================
// // GLOBAL STATE (Outside the hook)
// // These variables survive component re-renders and React Strict Mode cycles
// // =========================================================================
// let webContainerInstance: WebContainer | null = null;
// let bootPromise: Promise<WebContainer> | null = null;
// let currentServerUrl: string | null = null;

// interface UseWebContainerProps {
//   templateData: TemplateFolder | null;
// }

// interface UseWebContainerReturn {
//   serverUrl: string | null;
//   isLoading: boolean;
//   error: string | null;
//   instance: WebContainer | null;
//   writeFileSync: (path: string, content: string) => Promise<void>;
//   destroy: () => void;
// }

// export const useWebContainer = ({ templateData }: UseWebContainerProps): UseWebContainerReturn => {
//   const [serverUrl, setServerUrl] = useState<string | null>(currentServerUrl);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [instance, setInstance] = useState<WebContainer | null>(null);

//   useEffect(() => {
//     let mounted = true;

//     async function initializeWebContainer() {
//       try {
//         // 1. If we already have a ready instance, use it immediately
//         if (webContainerInstance) {
//           if (mounted) {
//             setInstance(webContainerInstance);
//             setServerUrl(currentServerUrl);
//             setIsLoading(false);
//           }
//           return;
//         }

//         // 2. If boot is already starting (but not finished), wait for that same promise
//         if (!bootPromise) {
//           bootPromise = WebContainer.boot();
//         }

//         const bootedInstance = await bootPromise;

//         // 3. Assign the result to the global variable
//         webContainerInstance = bootedInstance;

//         bootedInstance.on('server-ready', (port, url) => {
//             currentServerUrl = url; // Update global variable
//             // If component is mounted, update local state
//             // We use a small timeout or check explicitly to handle state updates
//             // (Note: Since this listener persists, we rely on the global variable mostly)
//         });

//         if (mounted) {
//           setInstance(bootedInstance);
//           setIsLoading(false);
//         }
//       } catch (err) {
//         console.error("Failed to initialize WebContainer:", err);

//         // If it failed, clear the promise so we can try again later if needed
//         bootPromise = null;

//         if (mounted) {
//           setError(err instanceof Error ? err.message : "Failed to initialize WebContainer");
//           setIsLoading(false);
//         }
//       }
//     }

//     initializeWebContainer();

//     if (webContainerInstance) {
//         const syncUrl = (port: number, url: string) => {
//             if (mounted) setServerUrl(url);
//         };
//         webContainerInstance.on('server-ready', syncUrl);
//     }

//     // Cleanup: We intentionally DO NOT teardown the instance on unmount.
//     // This prevents the "Strict Mode" crash and keeps the container alive for navigation.
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
//     if (!instance) {
//       throw new Error("WebContainer instance is not initialized");
//     }

//     try {
//       const pathParts = path.split("/");
//       const folderPath = pathParts.slice(0, -1).join("/");
//       if (folderPath) {
//         await instance.fs.mkdir(folderPath, { recursive: true });
//       }
//       await instance.fs.writeFile(path, content);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to write file";
//       console.error(`Error writing file at ${path}:`, errorMessage);
//       throw new Error(`Error writing file at ${path}: ${errorMessage}`);
//     }
//   }, [instance]);

//   const destroy = useCallback(() => {
//     if (webContainerInstance) {
//       try {
//         webContainerInstance.teardown();
//       } catch (e) {
//         console.warn("Teardown error", e);
//       }
//     }
//     // Reset globals
//     webContainerInstance = null;
//     bootPromise = null;
//     currentServerUrl = null;
//     // Reset local state
//     setInstance(null);
//     setServerUrl(null);
//   }, []);

//   return {
//     serverUrl,
//     isLoading,
//     error,
//     instance,
//     writeFileSync,
//     destroy,
//   };
// };

import { useState, useEffect, useCallback } from "react";
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
  // Initialize state from global variable
  const [serverUrl, setServerUrl] = useState<string | null>(globalServerUrl);
  const [isLoading, setIsLoading] = useState<boolean>(!webContainerInstance);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(webContainerInstance);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // If we already have an instance, sync state and exit
        if (webContainerInstance) {
          if (mounted) {
            setInstance(webContainerInstance);
            setServerUrl(globalServerUrl);
            setIsLoading(false);
          }
          return;
        }

        // Boot if not booting
        if (!bootPromise) {
          bootPromise = WebContainer.boot();
        }

        const booted = await bootPromise;
        webContainerInstance = booted;

        // --- GLOBAL EVENT LISTENER ---
        booted.on('server-ready', (port, url) => {
          console.log("Global server-ready event:", url);
          globalServerUrl = url;
        });

        if (mounted) {
          setInstance(booted);
          setIsLoading(false);
        }

      } catch (err) {
        console.error("WebContainer boot failed:", err);
        bootPromise = null;
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
          setIsLoading(false);
        }
      }
    }

    init();
    
    const interval = setInterval(() => {
      if (globalServerUrl !== serverUrl && mounted) {
        setServerUrl(globalServerUrl);
      }
    }, 500); // Check every 500ms if the global URL has appeared

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [serverUrl]); // Re-run if local serverUrl is different

  const writeFileSync = useCallback(async (path: string, content: string) => {
    if (!webContainerInstance) return;
    try {
      const pathParts = path.split("/");
      const folderPath = pathParts.slice(0, -1).join("/");
      if (folderPath) await webContainerInstance.fs.mkdir(folderPath, { recursive: true });
      await webContainerInstance.fs.writeFile(path, content);
    } catch (e) {
      console.error("Write failed", e);
    }
  }, []);

  return {
    serverUrl,
    isLoading,
    error,
    instance,
    writeFileSync,
  };
};