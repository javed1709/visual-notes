import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MarkdownRenderer({ content }) {
  useEffect(() => {
    // Initialize Mermaid diagrams after rendering
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, [content]);

  return (
    <div className="markdown-preview p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            // Handle inline code
            if (inline) {
              return (
                <code 
                  className="bg-accent-coral-100 dark:bg-accent-purple-700/50 px-1.5 py-0.5 rounded text-primary-coral dark:text-primary-purple font-mono text-sm" 
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            // Get language from the className
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            // Special case for Mermaid diagrams
            if (language === 'mermaid') {
              return (
                <div className="mermaid my-4">
                  {String(children).replace(/\n$/, '')}
                </div>
              );
            }
            
            // For all other code blocks, use syntax highlighting
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-accent-coral-200 dark:border-accent-purple-300">
                <SyntaxHighlighter
                  style={oneDark}
                  language={language || 'text'}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem',
                    fontSize: '0.9rem',
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
          // Add styling for other elements
          h1: ({ node, children, ...props }) => (
            <h1 className="text-3xl font-bold mt-6 mb-4 text-text-primary dark:text-text-light" {...props}>{children}</h1>
          ),
          h2: ({ node, children, ...props }) => (
            <h2 className="text-2xl font-bold mt-5 mb-3 text-text-primary dark:text-text-light" {...props}>{children}</h2>
          ),
          h3: ({ node, children, ...props }) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-text-primary dark:text-text-light" {...props}>{children}</h3>
          ),
          p: ({ node, children, ...props }) => (
            <p className="mb-4 text-text-primary dark:text-text-light" {...props}>{children}</p>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-1" {...props}>{children}</li>
          ),
          table: ({ node, children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse border border-accent-coral-200 dark:border-accent-purple-300" {...props}>{children}</table>
            </div>
          ),
          thead: ({ node, children, ...props }) => (
            <thead className="bg-accent-coral-100 dark:bg-accent-purple-700/50" {...props}>{children}</thead>
          ),
          th: ({ node, children, ...props }) => (
            <th className="border border-accent-coral-200 dark:border-accent-purple-300 px-4 py-2 text-left" {...props}>{children}</th>
          ),
          td: ({ node, children, ...props }) => (
            <td className="border border-accent-coral-200 dark:border-accent-purple-300 px-4 py-2" {...props}>{children}</td>
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="pl-4 border-l-4 border-accent-coral-300 dark:border-accent-purple-500 italic mb-4" {...props}>{children}</blockquote>
          ),
        }}
      />
    </div>
  );
}

export default MarkdownRenderer;