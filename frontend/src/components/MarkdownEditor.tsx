"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}

export default function MarkdownEditor({
  value,
  onChange,
  label,
  required = false,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {isPreview ? (
        <div className="prose dark:prose-invert max-w-none p-3 border rounded bg-gray-50 dark:bg-gray-900 min-h-[200px]">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border px-3 py-2 rounded dark:bg-gray-700 dark:text-white min-h-[200px]"
          required={required}
          placeholder="You can use markdown formatting here..."
        />
      )}

      {!isPreview && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Supports markdown: **bold**, *italic*, # headers, - lists,
          [links](url)
        </div>
      )}
    </div>
  );
}
