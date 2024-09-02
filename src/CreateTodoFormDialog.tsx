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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/actions";
import { toast } from "sonner";
import { createTodo } from "./api";
import { useMutation } from "@tanstack/react-query";

export default function CreateTodoFormDialog({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo_title: "",
    },
  });

  const addTodo = useMutation({
    mutationKey: ["addTodo"],
    mutationFn: (val: z.infer<typeof formSchema>) => createTodo(val),
    onSuccess: () => {
      refetch();
      setOpen(false);
      toast.success("Added Todo task");
      form.reset();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addTodo.mutate(values);
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="todo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Todo</FormLabel>
                  <FormControl>
                    <Input placeholder="Excercise 20 minutes💪🏽" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={addTodo.isPending}>Create Todo Task</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
