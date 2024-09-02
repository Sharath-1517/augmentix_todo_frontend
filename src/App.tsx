import { useEffect, useState } from "react";
import CreateTodoFormDialog from "./CreateTodoFormDialog";
import TodoTable from "@/TodoTable";
import { TodoList } from "./types/todo";
import { Toaster } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "./api";

function App() {
  const [todoList, setTodoList] = useState<TodoList | null>();

  const [open, setOpen] = useState<boolean>(false);

  const { data, isLoading, refetch } = useQuery<TodoList>({
    queryKey: ["todos"],
    queryFn: async () => {
      const listItems = await getTodos();

      const returnData = (await listItems.json()).data;

      return returnData as TodoList;
    },
  });

  console.log({ data });

  useEffect(() => {
    setTodoList(data);
  }, [data]);

  return (
    <div className="h-full relative">
      <div className="absolute h-full w-full bg-white -z-50">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>
      <Toaster richColors />
      <div>
        <header className="p-2">
          <nav className="flex w-full justify-between px-2 py-3 items-center">
            <div className="font-montserrat text-xl">Todo List App</div>
            <div>
              <CreateTodoFormDialog
                open={open}
                setOpen={setOpen}
                refetch={refetch}
              />
            </div>
          </nav>
        </header>
        {isLoading && (
          <div className="fixed h-screen w-screen bg-black/5 z-50 flex flex-col justify-center items-center">
            Loading...
          </div>
        )}
        <div className="w-full h-full flex justify-center items-center py-4">
          {/* <ToDoList list={todoList} refetch={refetch} /> */}
          <TodoTable list={todoList || []} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}

export default App;
