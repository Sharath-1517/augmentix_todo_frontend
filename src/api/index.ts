import { z } from "zod";
import { formSchema } from "@/lib/actions";
import { ToDo } from "@/types/todo";

export async function fetchData({
  endpoint,
  data,
  method,
}: {
  data?: unknown;
  endpoint: string;
  method: "POST" | "GET" | "PUT";
}) {
  if (method == "GET") {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
}

export const getTodos = async () =>
  fetchData({
    endpoint: "todos",
    method: "GET",
  });

export async function createTodo(val: z.infer<typeof formSchema>) {
  return fetchData({
    endpoint: "create",
    method: "POST",
    data: val,
  });
}

export async function updateTodo({
  id,
  todo_title,
}: {
  id: string;
  todo_title: string;
}) {
  return fetchData({
    endpoint: "update",
    method: "PUT",
    data: { todo_title, _id: id },
  });
}

export async function updateTaskStatusApi({ id, todo_status }: Partial<ToDo>) {
  return fetchData({
    endpoint: "update",
    method: "PUT",
    data: { _id: id, todo_status },
  });
}

export async function deleteTaskApi({ _id }: { _id: string }) {
  return fetchData({
    endpoint: "delete/",
    method: "POST",
    data: { todoId: _id },
  });
}
