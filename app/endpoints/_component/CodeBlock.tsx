'use client';

import { useState } from 'react';
//@ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//@ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

type FetchCodeBlockProps = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, any>;
};

export default function FetchCodeBlock({
  url,
  method = 'POST',
  headers = {
    'Content-Type': 'application/json',
  },
  body = {},
}: FetchCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const formattedHeaders = JSON.stringify(headers, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, `'`);

  const formattedBody = JSON.stringify(body, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, `'`);

  const code = `fetch('${url}', {
  method: '${method}',
  headers: ${formattedHeaders},
  body: JSON.stringify(${formattedBody})
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-md overflow-auto bg-zinc-900 p-8 w-full h-fit">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="text-white hover:bg-zinc-800"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={oneDark}
        customStyle={{
          background: 'transparent',
          padding: 0,
          margin: 0,
        }}
        codeTagProps={{
          style: {
            background: 'transparent',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
      {copied && (
        <div className="absolute bottom-2 right-4 text-xs text-green-400">
          Copied!
        </div>
      )}
    </div>
  );
}
