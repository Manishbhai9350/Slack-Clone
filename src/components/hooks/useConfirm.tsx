import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FC, useState } from "react";

interface ConfirmJSXProps {
  title: string;
  message: string;
}

const UseConfirm = ():[() => Promise<unknown>,FC<ConfirmJSXProps>] => {
  const [ConfirmPromise, setConfirmPromise] = useState<{
    resolve: (val:boolean) => void;
  } | null>(null);

  const Confirm = () => {
    return new Promise((resolve) => {
      setConfirmPromise({resolve});
    });
  };

  const HandleClose = () => {
    setConfirmPromise(null)
  }

  const HandleConfirmCancel = () => {
    ConfirmPromise?.resolve(false)
    HandleClose()
  };
  const HandleConfirm = () => {
    ConfirmPromise?.resolve(true)
    HandleClose()
  };

  const ConfirmDialog = ({ title, message }: ConfirmJSXProps) => {
    return (
      <Dialog open={!!ConfirmPromise} onOpenChange={HandleConfirmCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{message}</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={HandleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return [Confirm, ConfirmDialog];
};

export default UseConfirm;
