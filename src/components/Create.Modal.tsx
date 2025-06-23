import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CreateModalprops {
  children: ReactNode;
  onCreate?: (val:string) => void;
  onCancel?: () => void;
  setOpen:Dispatch<SetStateAction<boolean>>;
  open:boolean;
  disabled?: boolean;
  create?: string;
  cancel?: string;
  label?: string;
  placeholder?: string;
}

const CreateModal = ({
  children,
  onCreate = () => {},
  onCancel = () => {},
  setOpen = () => {},
  open = false,
  disabled = false,
  create = "Create",
  cancel = "Cancel",
  label = "Create",
  placeholder = "Create Something New",
}: CreateModalprops) => {
  const [Value, setValue] = useState("");

  function HandleOnCreate(){
    onCreate(Value)
    setValue('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <Input
          value={Value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          type="text"
          placeholder={placeholder}
        />
        <div className="buttons w-full flex gap-1">
          <DialogClose asChild>
            <Button
              className="w-1/2 "
              onClick={onCancel}
              disabled={disabled}
              variant="outline"
            >
              {cancel}
            </Button>
          </DialogClose>
          <Button
            className="w-1/2 "
            onClick={HandleOnCreate}
            disabled={disabled}
            variant="default"
          >
            {create}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
