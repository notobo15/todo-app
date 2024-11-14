// app/api/todo/[id]/complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/utils/fileUtils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await readData();
  const index = data.findIndex((t) => t.id === params.id);

  if (index === -1) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  // Toggle isCompleted
  data[index].isCompleted = !data[index].isCompleted;
  await writeData(data);

  return NextResponse.json({
    message: "Todo completion status updated",
    todo: data[index],
  });
}
