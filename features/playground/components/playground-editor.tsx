"use client";

import { useRef, useEffect, useCallback } from "react";
import Editor, { type Monaco } from "@monaco-editor/react";
import { TemplateFile } from "../lib/path-to-json";
import {
  configureMonaco,
  defaultEditorOptions,
  getEditorLanguage,
} from "@/features/playground/lib/editor-config";

interface PlaygroundEditorProps {
  activeFile: TemplateFile | undefined;
  content: string;
  onContentChange: (value: string) => void;
  suggestion: string | null;
  suggestionLoading: boolean;
  suggestionPosition: { line: number; column: number } | null;
  onAcceptSuggestion: (editor: any, monaco: any) => void;
  onRejectSuggestion: (editor: any) => void;
  onTriggerSuggestion: (type: string, editor: any) => void;
}

const PlaygroundEditor = ({
  activeFile,
  content,
  onContentChange,
  suggestion,
  suggestionLoading,
  suggestionPosition,
  onAcceptSuggestion,
  onRejectSuggestion,
  onTriggerSuggestion,
}: PlaygroundEditorProps) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const inlineCompletionProviderRef = useRef<any>(null);
  const currentSuggestionRef = useRef<{
    text: string;
    position: { line: number; column: number };
    id: string;
  } | null>(null);
  const isAcceptingSuggestionRef = useRef(false);
  const suggestionAcceptedRef = useRef(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tabCommandRef = useRef<any>(null);

  // Generate unique ID for each suggestion
  const generateSuggestionId = () =>
    `suggestion-${Date.now()}-${Math.random()}`;

  const createInlineCompletionProvider = useCallback(
    (monaco: Monaco) => ({
      provideInlineCompletions: () => {
        if (
          !suggestion ||
          isAcceptingSuggestionRef.current ||
          suggestionAcceptedRef.current
        ) {
          return { items: [] };
        }

        const suggestionId = generateSuggestionId();
        currentSuggestionRef.current = {
          text: suggestion,
          position: suggestionPosition!,
          id: suggestionId,
        };

        const cleanSuggestion = suggestion.replace(/\r/g, "");

        return {
          items: [
            {
              insertText: cleanSuggestion,
              range: new monaco.Range(
                editorRef.current.getPosition().lineNumber,
                editorRef.current.getPosition().column,
                editorRef.current.getPosition().lineNumber,
                editorRef.current.getPosition().column,
              ),
              kind: monaco.languages.CompletionItemKind.Snippet,
              label: "AI Suggestion",
              detail: "AI-generated suggestion",
              documentation: "Press Tab to accept",
              sortText: "0000",
              filterText: "",
              // Prevent Monaco from inserting text itself
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
          ],
        };
      },
      freeInlineCompletions: (completions: any) => {
        console.log("freeInlineCompletions called");
      },
      disposeInlineCompletions: (completions: any) => {
        console.log("disposeInlineCompletions called");
      },
    }),
    [suggestion, suggestionPosition],
  );

  // Clear current suggestion
  const clearCurrentSuggestion = useCallback(() => {
    console.log("Clearing current suggestion");
    currentSuggestionRef.current = null;
    suggestionAcceptedRef.current = false;
    if (editorRef.current) {
      editorRef.current.trigger("ai", "editor.action.inlineSuggest.hide", null);
    }
  }, []);

  const acceptCurrentSuggestion = useCallback(() => {
    if (
      !editorRef.current ||
      !monacoRef.current ||
      !currentSuggestionRef.current
    )
      return false;

    if (isAcceptingSuggestionRef.current || suggestionAcceptedRef.current)
      return false;

    isAcceptingSuggestionRef.current = true;
    suggestionAcceptedRef.current = true;

    try {
      const editor = editorRef.current;
      const monaco = monacoRef.current;

      const cleanSuggestionText = currentSuggestionRef.current.text.replace(
        /\r/g,
        "",
      );

      const position = editor.getPosition();

      const range = new monaco.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column,
      );

      editor.executeEdits("ai-suggestion", [
        {
          range,
          text: cleanSuggestionText,
          forceMoveMarkers: true,
        },
      ]);

      const lines = cleanSuggestionText.split("\n");

      const endLine = position.lineNumber + lines.length - 1;

      const endColumn =
        lines.length === 1
          ? position.column + cleanSuggestionText.length
          : lines[lines.length - 1].length + 1;

      editor.setPosition({ lineNumber: endLine, column: endColumn });

      clearCurrentSuggestion();

      return true;
    } catch (e) {
      console.error("Error accepting suggestion", e);
      return false;
    } finally {
      isAcceptingSuggestionRef.current = false;

      setTimeout(() => {
        suggestionAcceptedRef.current = false;
      }, 1000);
    }
  }, [clearCurrentSuggestion]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    if (inlineCompletionProviderRef.current) {
      inlineCompletionProviderRef.current.dispose();
    }

    currentSuggestionRef.current = null;

    if (suggestion) {
      const language = getEditorLanguage(activeFile?.fileExtension || "");
      const provider = createInlineCompletionProvider(monacoRef.current);

      inlineCompletionProviderRef.current =
        monacoRef.current.languages.registerInlineCompletionsProvider(
          language,
          provider,
        );

      setTimeout(() => {
        editorRef.current?.trigger(
          "ai",
          "editor.action.inlineSuggest.trigger",
          null,
        );
      }, 50);
    }

    return () => {
      if (inlineCompletionProviderRef.current) {
        inlineCompletionProviderRef.current.dispose();
        inlineCompletionProviderRef.current = null;
      }
    };
  }, [suggestion, activeFile, createInlineCompletionProvider]);


  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    configureMonaco(monaco);

    editor.updateOptions({
      ...defaultEditorOptions,
      inlineSuggest: { enabled: true },
      suggest: { preview: false },
      quickSuggestions: { other: true, comments: false, strings: false },
      cursorSmoothCaretAnimation: "on",
    });

    if (tabCommandRef.current) {
      tabCommandRef.current.dispose();
    }


    tabCommandRef.current = editor.addCommand(monaco.KeyCode.Tab, () => {
      if (currentSuggestionRef.current) {
        const accepted = acceptCurrentSuggestion();
        if (accepted) return;
      }

      editor.trigger("editor", "editor.action.indentLines", null);
    });

    editor.addCommand(monaco.KeyCode.Escape, () => {
      if (currentSuggestionRef.current) {
        onRejectSuggestion(editor);
        clearCurrentSuggestion();
      }
    });

    editor.onDidChangeCursorPosition(() => {
      if (suggestionTimeoutRef.current)
        clearTimeout(suggestionTimeoutRef.current);

      if (
        !isAcceptingSuggestionRef.current &&
        !suggestionLoading &&
        !currentSuggestionRef.current
      ) {
        suggestionTimeoutRef.current = setTimeout(() => {
          onTriggerSuggestion("completion", editor);
        }, 300);
      }
    });

    editor.onDidChangeModelContent((e: any) => {
      if (isAcceptingSuggestionRef.current) return;

      if (
        currentSuggestionRef.current &&
        !suggestionAcceptedRef.current &&
        e.changes.length > 0
      ) {
        const change = e.changes[0];
        if (
          change.text === currentSuggestionRef.current.text ||
          change.text === currentSuggestionRef.current.text.replace(/\r/g, "")
        ) {
          return;
        }
        clearCurrentSuggestion();
      }

      const triggers = ["\n", "{", ".", "=", "(", ",", ":", ";"];
      if (e.changes.length > 0 && triggers.includes(e.changes[0].text)) {
        setTimeout(() => {
          if (
            editorRef.current &&
            !currentSuggestionRef.current &&
            !suggestionLoading
          ) {
            onTriggerSuggestion("completion", editorRef.current);
          }
        }, 100);
      }
    });

    updateEditorLanguage();
  };

  const updateEditorLanguage = () => {
    if (!activeFile || !monacoRef.current || !editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;
    const language = getEditorLanguage(activeFile.fileExtension || "");
    try {
      monacoRef.current.editor.setModelLanguage(model, language);
    } catch (error) {
      console.warn("Failed to update editor language:", error);
    }
  };

  useEffect(() => {
    updateEditorLanguage();
  }, [activeFile]);

  useEffect(() => {
    return () => {
      if (suggestionTimeoutRef.current)
        clearTimeout(suggestionTimeoutRef.current);
      if (inlineCompletionProviderRef.current)
        inlineCompletionProviderRef.current.dispose();
      if (tabCommandRef.current) tabCommandRef.current.dispose();
    };
  }, []);

  return (
    <div className="h-full relative">
      {/** ai thinking editor */}
      {suggestionLoading && (
        <div className="absolute top-2 right-2 z-10 bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          AI thinking...
        </div>
      )}

      {/* Active suggestion indicator */}
      {currentSuggestionRef.current && !suggestionLoading && (
        <div className="absolute top-2 right-2 z-10 bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Press Tab to accept
        </div>
      )}
      <Editor
        height={"100%"}
        value={content}
        onChange={(value) => onContentChange(value || "")}
        language={
          activeFile
            ? getEditorLanguage(activeFile.fileExtension || "")
            : "plaintext"
        }
        onMount={handleEditorDidMount}
        // @ts-expect-error-ignore
        options={defaultEditorOptions}
      />
    </div>
  );
};

export default PlaygroundEditor;