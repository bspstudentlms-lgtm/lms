import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const payload = {
      unique_id: String(body.userId),
      name: body.name,
      email: body.email,
      number: body.phone,
    };

    console.log("MSG91 SECRET KEY:", process.env.MSG91_SECRET_KEY);
console.log("JWT Payload:", payload);
    

    const token = jwt.sign(
      payload,
      process.env.MSG91_SECRET_KEY as string,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
    console.log("MSG Token", token);

    console.log("TOKEN:", token);

const parts = token.split(".");
console.log("HEADER:", parts[0]);
console.log("PAYLOAD:", parts[1]);
console.log("SIGNATURE:", parts[2]);

    const verify = jwt.verify(
      token,
      process.env.MSG91_SECRET_KEY as string
    );

    console.log("VERIFY SUCCESS:", verify);

    return NextResponse.json({
      success: true,
      token,
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
    });
  }
}