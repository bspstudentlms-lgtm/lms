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

          const existingScript = document.getElementById("msg91-script");

          if (existingScript) {
            console.log("MSG91 Script already loaded");

            const waitForWidget = setInterval(() => {
              if (window.initChatWidget) {
                clearInterval(waitForWidget);

                window.initChatWidget({
                  widgetToken: "e78b8",
                  unique_id: `guest_${Date.now()}`,
                  name: "Guest",
                  hide_launcher: false,
                  launch_widget: true,
                });

                console.log("GUEST WIDGET REINITIALIZED");
                setTimeout(() => {
                  const placeholder = document.querySelector(
                    'input[placeholder="Message AI Assistant..."]'
                  ) as HTMLInputElement | null;

                  console.log("INPUT FOUND:", placeholder);

                  if (placeholder) {
                    placeholder.placeholder = "Type Siva your message here...";
                    console.log("Placeholder updated");
                  }
                }, 5000);
              }
            }, 500);

            return;
          }

          const script = document.createElement("script");

          script.id = "msg91-script";
          script.src = "https://blacksea.msg91.com/chat-widget.js";
          script.async = true;

          script.onload = () => {
            console.log("MSG91 GUEST SCRIPT LOADED");

            window.initChatWidget({
              widgetToken: "e78b8",
              unique_id: `guest_${Date.now()}`,
              name: "Guest",
              hide_launcher: false,
              launch_widget: true,
            });

            console.log("GUEST WIDGET INITIALIZED");
            

            setTimeout(() => {
              console.log("iframe count", document.querySelectorAll("iframe").length);
            }, 3000);
            setTimeout(() => {
              const placeholder = document.querySelector(
                'input[placeholder="Message AI Assistant..."]'
              ) as HTMLInputElement | null;

              console.log("INPUT FOUND:", placeholder);
              const iframe =
                document.querySelector("#hello-chatbot-iframe-container iframe");

              console.log(iframe);

              if (placeholder) {
                placeholder.placeholder = "Type Siva your message here...";
                console.log("Placeholder updated");
              }
            }, 5000);

            setTimeout(() => {
              try {
                const iframe = document.getElementById(
                  "hello-chatbot-iframe-component"
                ) as HTMLIFrameElement;

                if (!iframe) {
                  console.log("Iframe not found");
                  return;
                }

                const iframeDoc =
                  iframe.contentDocument ||
                  iframe.contentWindow?.document;

                const heading = Array.from(
                  iframeDoc?.querySelectorAll("*") || []
                ).find(
                  (el) =>
                    el.textContent?.trim() ===
                    "What can I help with?"
                );

                if (heading) {
                  heading.textContent =
                    "How can Backstage Pass help you today?";
                }
              } catch (err) {
                console.error(
                  "Cross-origin iframe blocked access",
                  err
                );
              }
            }, 5000);


          };

          script.onerror = () => {
            console.error("Guest widget script failed");
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