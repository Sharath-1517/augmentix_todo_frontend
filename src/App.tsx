import { useEffect, useState } from "react";
import CreateTodoFormDialog from "./components/CreateTodoFormDialog";
import TodoTable from "@/TodoTable";
import { TodoList } from "./types/todo";
import { Toaster } from "sonner";
import { fetchData } from "@/api";
import CreateTodoForm from "./CreateTodoForm";

function App() {
  const [todoList, setTodoList] = useState<TodoList | null>();

  const [open, setOpen] = useState<boolean>(false);

  const refetch = async () => {
    const data = await fetchData({
      endpoint: "todo/todos",
      method: "GET",
    });
    setTodoList(await (await data.json()).data);
  };

  useEffect(() => {
    refetch();
  }, []);

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
              <CreateTodoFormDialog open={open} setOpen={setOpen}>
                <CreateTodoForm refetch={refetch} closeDialog={setOpen} />
              </CreateTodoFormDialog>
            </div>
          </nav>
        </header>
        <div className="w-full h-full flex justify-center items-center py-4">
          {/* <ToDoList list={todoList} refetch={refetch} /> */}
          <TodoTable list={todoList || []} refetch={refetch} />
        </div>
      </div>
    </div>
  );
}

export default App;
