import Quill, { QuillOptions } from "quill";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Smile, ImageIcon } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import "quill/dist/quill.snow.css";
import { Button } from "./ui/button";
import Hint from "./Hint";

interface EditorProps {
  variant?: "create" | "update";
  onSubmit:() => void;
  onCancel:() => void;
  placeholder:string;
  disabled:boolean;
}

const Editor = ({ variant = "create", placeholder, onCancel, onSubmit, disabled }: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  const placeholderRef = useRef< string | null >(null);
  const onSumbmitRef = useRef< () => void | null >(null);
  const onCancelRef = useRef< () => void | null >(null);
  const disabeldRef = useRef< boolean | null >(null)
  
  const [Value, setValue] = useState("");
  const [IsToolBarVisible, setIsToolBarVisible] = useState(true)

  function HandleValueChange() {
    if (!quillRef.current) return;
    const Text = quillRef.current.getText();
    setValue(Text);
  }

  function ToggleToolbar(){
    if(!containerRef.current) return;
    setIsToolBarVisible(prev => !prev)
    containerRef.current?.querySelector('.ql-toolbar')?.classList?.toggle('hidden')
  }

  useLayoutEffect(() => {
    placeholderRef.current = placeholder
    onSumbmitRef.current = onSubmit
    onCancelRef.current = onCancel
    disabeldRef.current = disabled
  })

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current!;

    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder:placeholderRef.current!,
      modules:{
        toolbar:[
          ['bold','italic','strike'],
          ['link'],
          [{list:'ordered'},{list:'bullet'}]
        ],
        keyboard:{
          bindings:{
            enter:{
              key:'Enter',
              handler:() => {
                // TODO : Call the onSubmint fnc
                return;
              }
            },
          }
        }
      }
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quill.on(Quill.events.TEXT_CHANGE, HandleValueChange);
    quill.focus()

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) {
        container.innerHTML = "";
      }
      if(quillRef.current){
        quillRef.current = null;
      }
    };
  }, []);

  const ValueEmpty = Value.replace(/<(.|\n)*?>/g, "").trim().length == 0;

  return (
    <div className="flex flex-col pr-4">
      <div className="flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="tools flex p-2 z-[5]">
          <Hint label={IsToolBarVisible ? 'Hide-Formatting' : 'Show-Formatting'}>
            <Button onClick={ToggleToolbar} variant="ghost">
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button variant="ghost">
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant == "create" && (
            <Hint label="Image">
              <Button variant="ghost">
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
                disabled={disabled || ValueEmpty}
                className="ml-auto bg-slate-700 hover:bg-slate-700 transition"
              >
                <MdSend />
              </Button>
            </Hint>
          )}

        </div>
      </div>
      <div className="flex justify-end text-[10px] text-muted-foreground p-2">
        <strong>Shift + Enter</strong>&nbsp;to add a new line
      </div>
    </div>
  );
};

export default Editor;
