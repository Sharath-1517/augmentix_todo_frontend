import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { ToDo, TodoList } from "@/types/todo";
import { Checkbox } from "../components/ui/checkbox";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import TableInput from "../components/TableInput";
import { Search, Trash } from "lucide-react";
import { Input } from "../components/ui/input";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { deleteTaskApi, updateTaskStatusApi, updateTodo } from "@/api";
import { useMutation } from "@tanstack/react-query";

const Index = ({ list, refetch }: { list: TodoList; refetch: () => void }) => {
  const [search, setSearch] = useState<string>("");

  // const updateTask = async ({
  //   id,
  //   todo_title,
  // }: {
  //   id: string;
  //   todo_title: string;
  // }) => {
  //   const data = await fetchData({
  //     endpoint: "update",
  //     method: "PUT",
  //     data: { todo_title, _id: id },
  //   });

  //   const { message } = await data.json();

  //   if (data.ok) {
  //     toast.success(
  //       <>
  //         {message} <br />
  //         {todo_title}
  //       </>
  //     );
  //     refetch();
  //   } else {
  //     toast.error(
  //       <>
  //         Could not mark task as completed <br />
  //         {todo_title}
  //       </>
  //     );
  //   }
  // };

  const updateTask = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: ({ id, todo_title }: { id: string; todo_title: string }) =>
      updateTodo({ id, todo_title }),
    onSuccess: (successResponse) => {
      console.log(successResponse);
      toast.success("Updated task");
      refetch();
    },
  });

  const updateTaskStatus = useMutation({
    mutationKey: ["updateTodoStatus"],
    mutationFn: ({ id, todo_status }: Partial<ToDo>) =>
      updateTaskStatusApi({ id, todo_status }),
    onSuccess: async (successResponse) => {
      const { message } = await successResponse.json();
      toast.success(message);
      refetch();
    },
  });

  const deleteTask = useMutation({
    mutationKey: ["deleteTask"],
    mutationFn: ({ _id }: { _id: string }) =>
      deleteTaskApi({
        _id,
      }),
    onSuccess: () => {
      toast.success(
        <div className="text-ellipsis line-clamp-2">
          <p>Deleted Task</p>
        </div>
      );
      refetch();
    },
  });

  const columns: ColumnDef<ToDo>[] = [
    {
      accessorKey: "todo_status",
      header: "Status",
      cell: (props) => {
        const { todo_status, id } = props.row.original;

        return (
          <Checkbox
            checked={todo_status}
            onCheckedChange={(e) => {
              updateTaskStatus.mutate({ id, todo_status: !!e });
            }}
            className="border-black"
          />
        );
      },
    },
    {
      accessorKey: "todo_title",
      header: "Todo",
      cell: ({ cell }) => {
        const { todo_title: prevTitle, id, todo_status } = cell.row.original;

        return (
          <>
            {todo_status ? (
              <p>{prevTitle}</p>
            ) : (
              <TableInput
                todo_title={prevTitle}
                updateFunction={({ todo_title }) =>
                  updateTask.mutate({ id, todo_title })
                }
              />
            )}
          </>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
    {
      accessorKey: "completed_at",
      header: "Completed At",
      cell: ({ cell }) => {
        const completed_at = cell.row.original.completed_at;

        return (
          <p>
            {completed_at && cell.row.original.todo_status
              ? completed_at.toLocaleString("en-IN")
              : "-"}
          </p>
        );
      },
    },
    {
      accessorKey: "id",
      header: "",
      cell: ({ cell }) => {
        const { id } = cell.row.original;
        return (
          <Button
            variant={"destructive"}
            className="text-white p-3 h-fit"
            title="Delete task"
            aria-label="Delete Task"
            disabled={
              cell.row.original.todo_status ||
              updateTask.isPending ||
              deleteTask.isPending
            }
            onClick={() => {
              deleteTask.mutate({ _id: id });
            }}
          >
            <Trash size={16} />
          </Button>
        );
      },
    },
  ];

  const formattingArrayBySearch = useMemo(() => {
    return list.filter((listItem) =>
      listItem.todo_title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, list]);

  const table = useReactTable({
    data: search === "" ? list : formattingArrayBySearch,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {(updateTask.isPending || deleteTask.isPending) && (
        <div className="fixed h-full w-full z-[100] flex flex-col justify-center items-center"></div>
      )}
      <div className="w-full flex flex-col items-center px-2">
        <div className="relative flex items-center justify-end w-full mb-5 max-w-5xl">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for some task..."
            className="w-full"
            maxLength={50}
            disabled={list.length == 0}
          />
          <Search size={20} className="absolute right-3" />
        </div>
        <div className="rounded-md border w-full max-w-5xl text-nowrap">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      row.original.todo_status &&
                        "bg-gray-400 hover:bg-gray-400"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {search.length > 0 &&
                      formattingArrayBySearch.length == 0 &&
                      list.length > 0 &&
                      `No todos as "${search}"`}
                    {list.length == 0 &&
                      "No Todos yet🫤? Click Create Todo to create one 😀."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Index;
