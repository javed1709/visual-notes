import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import MermaidRenderer from "./MermaidRenderer";

function MarkdownRenderer({ content }) {
  const [key, setKey] = useState(0);

  // Force re-render when content changes to ensure Mermaid diagrams are properly initialized
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [content]);

  return (
    <div className="markdown-body prose prose-sm md:prose-base dark:prose-invert max-w-none" key={key}>
      <ReactMarkdown
        children={content || "Nothing to preview yet..."}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const value = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            
            // ONLY use MermaidRenderer when language is explicitly set to "mermaid"
            if (language === "mermaid") {
              return <MermaidRenderer chart={value} />;
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={language}
                PreTag="div"
                {...props}
              >
                {value}
              </SyntaxHighlighter>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;