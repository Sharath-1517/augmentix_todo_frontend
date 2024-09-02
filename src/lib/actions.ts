"use client";

import { z } from "zod";

export const formSchema = z.object({
  todo_title: z
    .string()
    .min(2, "Must contain atleast 2 characters")
    .max(50, "Must contain only 50 characters"),
});
