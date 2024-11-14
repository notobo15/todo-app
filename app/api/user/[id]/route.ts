// app/api/user/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types";
import { readData, writeData } from "@/utils/fileUtils";
import md5 from "md5";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const users: User[] = await readData("users");
  const user = users.find((u) => u.id === params.id);

  return user
    ? NextResponse.json(user)
    : NextResponse.json({ message: "User not found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const updatedData = await req.json();
  const users: User[] = await readData("users");
  const index = users.findIndex((u) => u.id === params.id);

  if (index === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // If updating password, hash the new password
  if (updatedData.password) {
    updatedData.password = md5(updatedData.password);
  }

  users[index] = { ...users[index], ...updatedData };
  await writeData("users", users);
  return NextResponse.json({ message: "User updated" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const users: User[] = await readData("users");
  const updatedUsers = users.filter((u) => u.id !== params.id);

  if (updatedUsers.length === users.length) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  await writeData("users", updatedUsers);
  return NextResponse.json({ message: "User deleted" });
}
