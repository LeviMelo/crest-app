// src/components/form-builder/JsonEditor.tsx
import React from 'react';
import Editor from 'react-simple-code-editor';
// @ts-ignore - prism-core has no type definitions, this is safe to ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json'; // This MUST be imported to register the 'json' language
import 'prismjs/themes/prism-tomorrow.css'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

interface JsonEditorProps {
  title: string;
  jsonString: string;
  onJsonChange: (value: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ title, jsonString, onJsonChange }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 1024);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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
    <Card className="h-full flex flex-col min-h-[300px] lg:min-h-[400px]">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg lg:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow relative p-3 lg:p-6">
        <div className="absolute inset-3 lg:inset-6">
          <Editor
            value={jsonString}
            onValueChange={handleChange}
            // FIX: Pass the loaded language object (languages.json), not the string 'json'
            highlight={(code) => highlight(code, languages.json, 'json')}
            padding={8}
            className={cn(
                "font-mono bg-[#2d2d2d] text-white rounded-md h-full w-full overflow-auto border",
                "text-xs lg:text-sm", // Mobile-responsive text size
                error ? 'border-destructive' : 'border-border'
            )}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: isMobile ? 11 : 12,
              lineHeight: isMobile ? 1.3 : 1.4,
            }}
          />
        </div>
      </CardContent>
      {error && (
        <div className="flex-shrink-0 p-2 lg:p-3 text-xs text-destructive bg-destructive/10 border-t border-destructive/50">
          <strong>JSON Error:</strong> {error}
        </div>
      )}
    </Card>
  );
};

export default JsonEditor;