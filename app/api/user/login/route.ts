import { NextRequest, NextResponse } from "next/server";
import md5 from "md5";
import { readData } from "@/utils/fileUtils";
import { User } from "@/types";

function generateToken(userId: string): string {
  // Encode user ID and timestamp as a simple Base64 string
  const tokenPayload = `${Date.now()}-${userId}`;
  return Buffer.from(tokenPayload).toString("base64");
}
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email và mật khẩu là bắt buộc." },
      { status: 400 }
    );
  }

  const users: User[] = await readData("users");
  const user = users.find((user) => user.email === email);

  if (!user) {
    return NextResponse.json(
      { message: "Email không tồn tại." },
      { status: 404 }
    );
  }

  const hashedPassword = md5(password);
  if (user.password !== hashedPassword) {
    return NextResponse.json(
      { message: "Mật khẩu không chính xác." },
      { status: 401 }
    );
  }
  console.log("user.id", user.id);
  const token = generateToken(user.id);
  const response = NextResponse.json({
    message: "Đăng nhập thành công.",
    user: { id: user.id, name: user.name, email: user.email },
  });

  // Set cookie with token, expires in 7 days
  response.cookies.set("userToken", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return response;
}
