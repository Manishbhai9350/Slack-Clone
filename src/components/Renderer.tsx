'use client'

import Quill,{ QuillOptions } from "quill";
import { useEffect, useRef, useState } from "react";


interface RendererProps {
  content: string; // Pass Quill Delta
}

const Renderer = ({content}:RendererProps) => {
  
  const containerRef = useRef<HTMLDivElement>(null);

  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current!;


    const options: QuillOptions = {
      theme: "snow",
    };

    const quill = new Quill(document.createElement('div'), options);
    quill.setContents(JSON.parse(content))
    quill.disable()

    setIsEmpty(quill && quill.getText().replace(/<(.|\n)*?>/g, "").trim().length == 0);

    container.innerHTML = quill.root.innerHTML

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [content]);

  if(isEmpty) {
    return null;
  }

  return (
    <div
      ref={containerRef}
    />
  );
}

export default Renderer