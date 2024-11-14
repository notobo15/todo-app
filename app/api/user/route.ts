// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import { readData, writeData } from "@/utils/fileUtils";

export async function GET() {
  const users = await readData("users"); // Assuming `readData` takes a filename argument
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  const users: User[] = await readData("users");

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 409 }
    );
  }

  // Hash the password and create a new user
  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    password: md5(password), // Hash password with MD5
    createdDate: new Date().toISOString(),
  };

  users.push(newUser);
  await writeData("users", users);
  return NextResponse.json(newUser, { status: 201 });
}
