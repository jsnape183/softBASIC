import React, { useEffect, useState, useRef } from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";

const Editor = ({ source, height, onChange, error = null }) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    if (!monaco) return;

    monaco.languages.register({ id: "softBasic" });
    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider("softBasic", {
      tokenizer: {
        root: [
          [/dim/i, "custom-keyword"],
          [/print/i, "custom-function"],
          [/call/i, "custom-function"],
          [/onupdate/i, "custom-event"],
          [/onkeydown/i, "custom-event"],
          [/onpointerdown/i, "custom-event"],
          [/onpointermove/i, "custom-event"],
          [/while/i, "custom-keyword"],
          [/endwhile/i, "custom-keyword"],
          [/if/i, "custom-keyword"],
          [/endif/i, "custom-keyword"],
          [/for/i, "custom-keyword"],
          [/in/i, "custom-keyword"],
          [/next/i, "custom-keyword"],
          [/function/i, "custom-keyword"],
          [/return/i, "custom-keyword"],
          [/endfunction/i, "custom-keyword"],
          [/and/i, "custom-keyword"],
          [/or/i, "custom-keyword"],
          [/not/i, "custom-keyword"],
          [/"(.*?)"/, "custom-literal"],
          [/'.*/, "custom-comment"]
        ]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme("softBasicTheme", {
      base: "vs",
      inherit: false,
      rules: [
        { token: "custom-keyword", foreground: "000080" },
        { token: "custom-function", foreground: "008000" },
        { token: "custom-event", foreground: "005000" },
        {
          token: "custom-comment",
          foreground: "666666",
          fontStyle: "italic"
        },
        { token: "custom-literal", foreground: "660000", fontStyle: "italic" }
      ]
    });

    setLanguageLoaded(true);
  }, [monaco, setLanguageLoaded]);

  const handleMount = (editor, instance) => {
    editorRef.current = editor;
    if (error) {
      instance.editor.setModelMarkers(editor.getModel(), "Error", [
        {
          endColumn: 1000,
          startColumn: error.col + 1,
          startLineNumber: error.line,
          endLineNumber: error.line,
          message: error.message,
          severity: 8
        }
      ]);
    }
  };

  if (monaco && editorRef && editorRef?.current && error) {
    monaco.editor.setModelMarkers(editorRef.current.getModel(), "Error", [
      {
        endColumn: 1000,
        startColumn: error.col + 1,
        startLineNumber: error.line,
        endLineNumber: error.line,
        message: error.message,
        severity: 8
      }
    ]);
  }

  return (
    languageLoaded && (
      <MonacoEditor
        height={height}
        language="softBasic"
        defaultLanguage="softBasic"
        defaultValue={source}
        theme="softBasicTheme"
        defaultTheme="softBasicTheme"
        onChange={onChange}
        onMount={handleMount}
      />
    )
  );
};

export default Editor;
