import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";

export default function CreateTodoFormDialog({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(!open)}>Create Todo Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="w-full flex flex-row justify-between items-center">
          <DialogTitle>Create Todo Task</DialogTitle>
          <DialogDescription></DialogDescription>
          <Button
            className="p-1"
            variant={"ghost"}
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
