import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = ({
  todo_title,
  updateFunction,
}: {
  todo_title: string;
  updateFunction: ({ todo_title }: { todo_title: string }) => void;
}) => {
  const [value, setValue] = useState<string>(todo_title);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(!open)}>
        <p className="w-full flex items-center gap-2">
          <span>{todo_title}</span>
          <Pencil size={14} />
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="w-full flex flex-row justify-between items-center">
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription></DialogDescription>
          <Button
            className="p-1"
            variant={"ghost"}
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </DialogHeader>
        <div className="relative flex items-center">
          <Textarea
            value={value}
            className="resize-none"
            maxLength={50}
            minLength={3}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (value.length < 3)
                toast.error("Must contain atleast 3 characters...");
              else updateFunction({ todo_title: value });
            }}
            disabled={value == todo_title}
          >
            Update Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Index;
