// src/components/form-builder/JsonEditor.tsx
import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css'; 
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { PiCheck, PiCopy } from 'react-icons/pi';

interface JsonEditorProps {
  jsonString: string;
  onJsonChange: (value: string) => void;
  readOnly?: boolean;
  showError?: boolean;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  jsonString, 
  onJsonChange, 
  readOnly = false,
  showError = true 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (value: string) => {
    onJsonChange(value);
    try {
      JSON.parse(value);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full w-full bg-gray-900 rounded-md border border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute top-2 right-2 z-10 h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10"
      >
        {copied ? <PiCheck className="text-emerald-400" /> : <PiCopy className="w-4 h-4" />}
      </Button>
      <div className="h-full w-full overflow-auto">
          <Editor
            value={jsonString}
          onValueChange={readOnly ? () => {} : handleChange}
            highlight={(code) => highlight(code, languages.json, 'json')}
            padding={10}
          className="font-mono text-xs text-white min-h-full"
            style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          readOnly={readOnly}
          />
        </div>
      {showError && error && (
        <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-destructive bg-destructive/20 border-t border-destructive/30">
          <strong>JSON Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default JsonEditor;