import Quill, { Delta, QuillOptions } from "quill";
import { Ref, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Smile, ImageIcon, XIcon } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import Hint from "./Hint";
import EmojiPopover from "./EmojiPopover";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface EditorProps {
  variant?: "create" | "update";
  onSubmit: (value: Delta, elem:HTMLInputElement) => void;
  onCancel: () => void;
  placeholder: string;
  disabled: boolean;
  innerRef: Ref;
}

const Editor = ({
  variant = "create",
  placeholder,
  onCancel,
  onSubmit,
  disabled,
  innerRef,
}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const placeholderRef = useRef<string | null>(null);
  const onSumbmitRef =
    useRef<(value: Delta, elem: HTMLInputElement) => void | null>(null);
  const onCancelRef = useRef<() => void | null>(null);
  const disabeldRef = useRef<boolean | null>(null);
  const imageELementRef = useRef<HTMLInputElement | null>(null);

  const [IMG, setIMG] = useState<File | null>(null);
  const [Value, setValue] = useState("");
  const [IsToolBarVisible, setIsToolBarVisible] = useState(true);

  function HandleValueChange() {
    if (!quillRef.current) return;
    const Text = quillRef.current.getText();
    setValue(Text);
  }

  function ToggleToolbar() {
    if (!containerRef.current) return;
    setIsToolBarVisible((prev) => !prev);
    containerRef.current
      ?.querySelector(".ql-toolbar")
      ?.classList?.toggle("hidden");
  }

  function HandleEmojiInput(emoji: { native: string }) {
    if (!quillRef.current) return;
    quillRef.current.insertText(
      quillRef.current.getSelection()?.index || 0,
      emoji.native
    );
  }

  useLayoutEffect(() => {
    placeholderRef.current = placeholder;
    onSumbmitRef.current = onSubmit;
    onCancelRef.current = onCancel;
    disabeldRef.current = disabled;
  });

 function HandleSubmit() {
  if (!quillRef.current) return;
  onSumbmitRef?.current?.(quillRef.current.getContents(), imageELementRef.current);
}


  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current!;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current!,
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
              handler: HandleSubmit,
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    innerRef.current = quill;
    quill.on(Quill.events.TEXT_CHANGE, HandleValueChange);
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
  }, []);

  useEffect(() => {
    if(disabled) {
      quillRef.current?.disable(true)
    } else {
      quillRef.current?.enable(true)
    }
    return () => {
      
    }
  }, [disabled])
  


  const ValueEmpty =
    !IMG && Value.replace(/<(.|\n)*?>/g, "").trim().length == 0;

  return (
    <div className="flex flex-col pr-4">
      <input
        ref={imageELementRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setIMG(file);
          }
        }}
      />

      <div className="flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        {IMG && (
          <div className="image-element p-2">
            <div className="size-16 rounded-sm overflow-hidden relative group">
              <Image
                src={URL.createObjectURL(IMG)}
                alt="Selected Image"
                fill
                className="object-cover"
              />
              <div
                onClick={() => {
                  if(disabled) return;
                  setIMG(null);
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
            label={IsToolBarVisible ? "Hide-Formatting" : "Show-Formatting"}
          >
            <Button onClick={ToggleToolbar} variant="ghost">
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={HandleEmojiInput} label="Emoji">
            <Button variant="ghost">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>
          {variant == "create" && (
            <Hint label="Image">
              <Button
                onClick={() => imageELementRef?.current?.click()}
                variant="ghost"
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant == "update" && (
            <div className="ml-auto flex gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-slate-700 hover:bg-slate-700 transition">
                Update
              </Button>
            </div>
          )}
          {variant == "create" && (
            <Hint label="Send">
              <Button
                onClick={HandleSubmit}
                disabled={disabled || ValueEmpty}
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
          ValueEmpty && "opacity-0"
        )}
      >
        <strong>Shift + Enter</strong>&nbsp;to add a new line
      </div>
    </div>
  );
};

export default Editor;
