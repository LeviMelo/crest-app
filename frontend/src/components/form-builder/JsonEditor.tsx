// src/components/form-builder/JsonEditor.tsx
import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import 'prismjs';
import 'prismjs/components/prism-json';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/themes/prism-tomorrow.css'; 
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface JsonEditorProps {
  title: string;
  jsonString: string;
  onJsonChange: (value: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ title, jsonString, onJsonChange }) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    onJsonChange(value);
    try {
      JSON.parse(value);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow relative">
        <div className="absolute inset-0 p-6 pt-0">
          <Editor
            value={jsonString}
            onValueChange={handleChange}
            highlight={(code) => highlight(code, languages.json, 'json')}
            padding={10}
            className="font-mono text-sm bg-[#2d2d2d] text-white rounded-md h-full w-full overflow-auto border border-border"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
      </CardContent>
      {error && (
        <div className="p-2 text-xs text-destructive bg-destructive/10 border-t">
          <strong>JSON Error:</strong> {error}
        </div>
      )}
    </Card>
  );
};

export default JsonEditor;