'use client'

import Quill,{ QuillOptions } from "quill";
import { useEffect, useRef } from "react";


interface RendererProps {
  content: string; // Pass Quill Delta
}

const Renderer = ({content}:RendererProps) => {
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(containerRef.current)
    if (!containerRef.current) return;

    const container = containerRef.current!;


    const options: QuillOptions = {
      theme: "snow",
    };

    const quill = new Quill(document.createElement('div'), options);
    quill.setContents(JSON.parse(content))
    quill.disable()

    container.innerHTML = quill.root.innerHTML

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
    />
  );
}

export default Renderer