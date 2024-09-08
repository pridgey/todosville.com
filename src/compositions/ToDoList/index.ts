import { clientOnly } from "@solidjs/start";

/* Render in client only */
export const ToDoList = clientOnly(() => import("./ToDoList"));
