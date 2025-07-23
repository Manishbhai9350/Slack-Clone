import Quill, { Delta, QuillOptions } from "quill";
import { Ref, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Smile, ImageIcon, XIcon } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import Hint from "./Hint";
import EmojiPopover from "./EmojiPopover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Id } from "../../convex/_generated/dataModel";

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: (value: Delta, elem: HTMLInputElement | null) => void;
  onCancel: () => void;
  placeholder: string;
  disabled: boolean;
  innerRef: Ref<Quill>;
  isEdit: null | Id<"messages">;
  updateValue: string;
  noControl?: boolean;
}

const Editor = ({
  variant = "create",
  placeholder,
  onCancel,
  onSubmit,
  disabled,
  innerRef,
  updateValue,
  noControl = false
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const placeholderRef = useRef<string>(placeholder);
  const onSubmitRef = useRef<(value: Delta, elem: HTMLInputElement | null) => void>(onSubmit);
  const onCancelRef = useRef<() => void>(onCancel);
  const disabledRef = useRef<boolean>(disabled);
  const imageElementRef = useRef<HTMLInputElement | null>(null);

  const [img, setImg] = useState<File | null>(null);
  const [value, setValue] = useState("");
  const [isToolBarVisible, setIsToolBarVisible] = useState(true);

  const handleValueChange = useCallback(() => {
    if (!quillRef.current) return;
    const text = quillRef.current.getText();
    setValue(text);
  }, []);

  const toggleToolbar = useCallback(() => {
    if (!containerRef.current) return;
    setIsToolBarVisible((prev) => !prev);
    containerRef.current
      ?.querySelector(".ql-toolbar")
      ?.classList?.toggle("hidden");
  }, []);

  const handleEmojiInput = useCallback((emoji: string) => {
    if (!quillRef.current) return;
    quillRef.current.insertText(
      quillRef.current.getSelection()?.index || 0,
      emoji
    );
  }, []);

  useLayoutEffect(() => {
    placeholderRef.current = placeholder;
    onSubmitRef.current = onSubmit;
    onCancelRef.current = onCancel;
    disabledRef.current = disabled;
  });

  const handleSubmit = useCallback(() => {
    if (!quillRef.current) return;
    onSubmitRef.current(
      quillRef.current.getContents(),
      imageElementRef.current
    );
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: handleSubmit,
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;

    // Handle ref assignment properly
    if (typeof innerRef === 'function') {
      innerRef(quill);
    } else if (innerRef && 'current' in innerRef) {
      (innerRef as React.MutableRefObject<Quill | null>).current = quill;
    }

    quill.on(Quill.events.TEXT_CHANGE, handleValueChange);
    quill.focus();

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);
      if (container) {
        container.innerHTML = "";
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [innerRef, handleSubmit, handleValueChange]);

  useEffect(() => {
    if (disabled) {
      quillRef.current?.disable();
    } else {
      quillRef.current?.enable(true);
    }
    return () => {};
  }, [disabled]);

  useEffect(() => {
    if (variant === "update") {
      quillRef.current?.setContents(JSON.parse(updateValue));
      quillRef.current?.focus();
      return;
    }
    quillRef.current?.setContents([]);
  }, [updateValue, variant]);

  const valueEmpty =
    !img && value.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col w-full">
      <input
        ref={imageElementRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImg(file);
          }
        }}
      />

      <div className="flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        {img && (
          <div className="image-element p-2">
            <div className="size-16 rounded-sm overflow-hidden relative group">
              <Image
                src={URL.createObjectURL(img)}
                alt="Selected Image"
                fill
                className="object-cover"
              />
              <div
                onClick={() => {
                  if (disabled) return;
                  setImg(null);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-black text-white rounded-full leading-none text-center opacity-0 group-hover:opacity-100 transition flex justify-center items-center cursor-pointer"
              >
                <XIcon className="size-4" />
              </div>
            </div>
          </div>
        )}
        <div className="tools flex p-2 z-[5]">
          <Hint
            label={isToolBarVisible ? "Hide-Formatting" : "Show-Formatting"}
          >
            <Button onClick={toggleToolbar} variant="ghost">
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={handleEmojiInput} label="Emoji">
            <Button variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant === "create" && !noControl && (
            <Hint label="Image">
              <Button
                onClick={() => imageElementRef?.current?.click()}
                variant="ghost"
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex gap-2">
              <Button
                disabled={disabled || valueEmpty}
                onClick={onCancel}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={disabled || valueEmpty}
                onClick={handleSubmit}
                className="bg-slate-700 hover:bg-slate-700 transition"
              >
                Update
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Hint label="Send">
              <Button
                onClick={handleSubmit}
                disabled={disabled || valueEmpty}
                className="ml-auto bg-slate-700 hover:bg-slate-700 transition"
              >
                <MdSend />
              </Button>
            </Hint>
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex justify-end text-[10px] text-muted-foreground p-2 transition",
          valueEmpty && "opacity-0"
        )}
      >
        <strong>Shift + Enter</strong>&nbsp;to add a new line
      </div>
    </div>
  );
};

export default Editor;