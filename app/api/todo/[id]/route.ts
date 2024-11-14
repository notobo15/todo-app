// app/api/todo/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/utils/fileUtils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await readData("todos");
  const todo = data.find((t) => t.id === params.id); // Use string comparison for UUID
  return todo
    ? NextResponse.json(todo)
    : NextResponse.json({ message: "Todo not found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const updatedTodoData = await req.json();
  const data = await readData("todos");
  const index = data.findIndex((t) => t.id === params.id); // Use string comparison for UUID

  if (index !== -1) {
    data[index] = { ...data[index], ...updatedTodoData };
    await writeData("todos", data);
    return NextResponse.json({ message: "Todo updated" });
  } else {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await readData("todos");
  const updatedData = data.filter((t) => t.id !== params.id); // Use string comparison for UUID

  if (updatedData.length === data.length) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  await writeData("todos", updatedData);
  return NextResponse.json({ message: "Todo deleted" });
}
