import { Todo } from "@/types";
import { readData, writeData } from "@/utils/fileUtils";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split("-");

    if (parts.length > 1) {
      return parts.slice(1).join("-");
    }

    return null;
  } catch {
    return null;
  }
}
export async function GET(req: NextRequest) {
  const token = req.cookies.get("userToken");
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided." },
      { status: 401 }
    );
  }

  const userId = getUserIdFromToken(token.value);
  console.log("userId", userId);
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid token." },
      { status: 401 }
    );
  }

  const todos: Todo[] = await readData("todos");
  const userTodos = todos.filter((todo) => todo.userId === userId);
  return NextResponse.json(userTodos);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("userToken");
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided." },
      { status: 401 }
    );
  }

  const userId = getUserIdFromToken(token.value);
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid token." },
      { status: 401 }
    );
  }

  const newTodoData = await req.json();
  const data = await readData("todos");

  const newId = uuidv4();
  const newTodo: Todo = {
    id: newId,
    todo: newTodoData.todo,
    createdDate: new Date().toISOString(),
    isCompleted: false,
    userId: userId, // Attach the userId from the token
  };

  data.push(newTodo);
  await writeData("todos", data);
  return NextResponse.json(newTodo, { status: 201 });
}
