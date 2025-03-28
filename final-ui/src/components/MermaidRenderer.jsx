import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

function MermaidRenderer({ chart }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");
  const uniqueId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false, // We'll manually render
      theme: "default",
      securityLevel: "loose",
      fontFamily: "sans-serif",
      logLevel: 1, // Only show errors
    });

    const renderChart = async () => {
      try {
        setError(null);
        setErrorDetails("");
        
        if (!chart || chart.trim() === "") {
          throw new Error("Empty diagram content");
        }
        
        // Check if this looks like valid mermaid syntax before rendering
        const trimmedChart = chart.trim();
        const validMermaidStart = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|gitGraph)/i.test(trimmedChart);
        
        if (!validMermaidStart) {
          throw new Error("Content doesn't appear to be a valid Mermaid diagram");
        }
        
        // Use mermaid API to render the chart
        const { svg } = await mermaid.render(uniqueId.current, trimmedChart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError("Failed to render Mermaid diagram");
        setErrorDetails(err.message || "Unknown error");
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      renderChart();
    }, 100); // Increased delay slightly

    return () => clearTimeout(timer);
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 rounded-md">
        <p className="font-bold">Error rendering diagram:</p>
        <p>{error}</p>
        {errorDetails && (
          <p className="text-sm mt-1">{errorDetails}</p>
        )}
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram my-4">
      {svg ? (
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="flex justify-center items-center h-32 bg-gray-100 dark:bg-gray-800 rounded-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-coral dark:border-primary-purple"></div>
        </div>
      )}
    </div>
  );
}

export default MermaidRenderer;