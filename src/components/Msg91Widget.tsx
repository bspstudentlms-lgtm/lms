"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    initChatWidget: any;
  }
}

export default function Msg91Widget() {

  useEffect(() => {

    const initWidget = async () => {

      const storedUser = localStorage.getItem("user");

if (!storedUser) return;

const parsedUser = JSON.parse(storedUser);

const name = parsedUser.name;
const email = parsedUser.email;
const phone = parsedUser.phone;
const userId = parsedUser.id;

      console.log("USER DATA", {
        name,
        email,
        phone,
        userId,
      });

      // ❌ user not logged in
      if (!email) return;

      // ✅ get JWT token from backend
      const response = await fetch("/api/msg91-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          userId,
        }),
      });

      const result = await response.json();

      console.log("MSG91 TOKEN RESPONSE", result);

      if (!result.token) {
        console.log("JWT token missing");
        return;
      }

      // ✅ load script
      const script = document.createElement("script");

      script.src = "https://blacksea.msg91.com/chat-widget.js";

      script.async = true;

      script.onload = () => {

        console.log("MSG91 SCRIPT LOADED");

  // ✅ Clear old anonymous session
  localStorage.removeItem("msg91_widget");
  sessionStorage.removeItem("msg91_widget");

        const helloConfig = {
  widgetToken: "e78b8",

  auth_token: result.token,

  unique_id: String(userId),

  visitor_name: name,
  visitor_email: email,
  visitor_phone: phone,

  show_widget_form: false,
  hide_launcher: false,
  launch_widget: false,
  show_close_button: true,
};
        console.log("INIT CONFIG", helloConfig);
console.log("HELLO CONFIG", helloConfig);
        if (window.initChatWidget) {
          window.initChatWidget(helloConfig);
          console.log("MSG91 INITIALIZED");
        }
      };

      document.body.appendChild(script);
    };

    initWidget();

  }, []);

  return null;
}