"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    initChatWidget: any;
  }
}

export default function Msg91Widget() {
  useEffect(() => {
    console.log("MSG91 COMPONENT LOADED");

    const loadWidget = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        //   const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          console.log("Guest User");
          console.log("User not logged in");

  // Redirect to LMS Google Login
  //window.location.href = "/signin";

          const script = document.createElement("script");
          script.src = "https://blacksea.msg91.com/chat-widget.js";
          script.async = true;

          script.onload = () => {
            window.initChatWidget({
              widgetToken: "e78b8",
              hide_launcher: false,
              launch_widget: false,
            });
          };

          document.body.appendChild(script);

          return;
        }

        const user = JSON.parse(storedUser);

        console.log("MSG User", user);

        const response = await fetch("/api/msg91-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone,
            userId: String(user.id),
          }),
        });

        const result = await response.json();

        console.log("MSG91 TOKEN RESPONSE", result);

        if (!result.token) {
          console.error("JWT token missing");
          return;
        }

        const existingScript = document.getElementById("msg91-script");

        if (existingScript) {
          console.log("MSG91 Script already loaded");
          initializeWidget(result.token, user);
          return;
        }

        const script = document.createElement("script");

        script.id = "msg91-script";
        script.src = "https://blacksea.msg91.com/chat-widget.js";
        script.async = true;

        script.onload = () => {
          console.log("MSG91 SCRIPT LOADED");
          console.log("window.initChatWidget", typeof window.initChatWidget);

          initializeWidget(result.token, user);
        };

        script.onerror = () => {
          console.error("MSG91 Script failed to load");
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error("MSG91 Error", error);
      }
    };

    const initializeWidget = (token: string, user: any) => {
      try {
        const helloConfig = {
          widgetToken: "e78b8",

          user_jwt_token: token,

          unique_id: String(user.id),

          name: user.name,
          email: user.email,
          number: user.phone,
        };

        console.log("JWT USER", {
          unique_id: String(user.id),
          visitor_name: user.name,
          visitor_email: user.email,
          visitor_phone: user.phone,
        });

        console.log("INIT CONFIG", helloConfig);
        console.log("TOKEN", token);

        if (window.initChatWidget) {
          window.initChatWidget(helloConfig);
          console.log("MSG91 INITIALIZED");
        } else {
          console.error("initChatWidget not found");
        }
      } catch (error) {
        console.error("Widget Init Error", error);
      }
    };

    loadWidget();
  }, []);

  return null;
}