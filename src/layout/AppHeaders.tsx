"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import mixpanel from "mixpanel-browser";


const AppHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Return null immediately if pathname is /signin (do not render header on signin page)
  if (pathname === "/signin") {
    return null;
  }

  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // const hideHeaderRoutes = ["/", "/all-courses"];

  // if (pathname && hideHeaderRoutes.includes(pathname)) {
  //   return null;
  // }


  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const handleSigninClick = () => {
    mixpanel.track("Login Button Clicked", {
      location: "Header",
    });

    router.push("/signin");
  };


  const { data: session, status } = useSession();

  const hasCheckedRef = useRef(false);
  const safeRedirect = (path: string) => {
    if (window.location.pathname !== path) {
      router.replace(path);
    }
  };

//   useEffect(() => {
//     const loginType = localStorage.getItem("loginType");
//     if (loginType === "manual") return;
//     if (status === "loading") return;

//     if (hasCheckedRef.current) return;
//     hasCheckedRef.current = true;

//     const redirectPath =
//       localStorage.getItem("postLoginRedirect") ||
//       window.location.pathname;

//     // console.log("STATUS:", status);
//     // console.log("SESSION:", session);

//     if (status === "authenticated" && session?.user?.email) {
     
//       const email = session.user.email;
//       const username = session?.user?.name || "";

//       const checkStudent = async () => {
//         try {
//            const res = await fetch(
//   `https://www.backstagepass.co.in/reactapi/check-student.php?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`,
//   { cache: "no-store" }
// );

//           const data = await res.json();

//           if (data.status === 200) {
//             localStorage.setItem("userId", data.userid);
//             localStorage.setItem("username", data.username);
//             localStorage.setItem("email", data.email);
//             localStorage.setItem("role", data.role);

//             const enrolled = String(data.enrolled).trim();
            
//             localStorage.setItem("enrolledcourses", String(enrolled));
//              const loginRedirectDone = localStorage.getItem("loginRedirectDone");
//               const previewTopicId = localStorage.getItem("previewTopicId");

               
//                  if (previewTopicId) {
//                    safeRedirect(redirectPath);
//                 } else {
//                   // normal flow
//                   if (enrolled && !loginRedirectDone) {
//                     localStorage.setItem("loginRedirectDone", "true");
//                     safeRedirect("/mycourses");
//                   } else {
//                     safeRedirect(redirectPath);
//                   }
//                 }
// // Preview

//             // if (enrolled && !loginRedirectDone) {

//             //   localStorage.setItem("loginRedirectDone", "true");
//             //   safeRedirect("/mycourses");
//             // } else {

//             //   safeRedirect(redirectPath);
//             // }
//           } else {
//             const user = session.user;
//             if (!user) return;

//             localStorage.setItem("username", user.name ?? "");
//             localStorage.setItem("email", user.email ?? "");
//             localStorage.setItem("image", user.image ?? "");
//             localStorage.setItem("role", "sos");
//             if (redirectPath == '/') {
//               if (window.location.pathname !== "/dashboard") {
//                 window.location.replace("/dashboard");
//               }
//             } else {
//               safeRedirect(redirectPath);
//             }
//           }

//           // ✅ VERY IMPORTANT
//           localStorage.removeItem("postLoginRedirect");

//         } catch (err) {
//           console.error("Login redirect error:", err);
//         }
//       };

//       checkStudent();
//     }
//   }, [status, session]);

// useEffect(() => {
  
//   const loginType = localStorage.getItem("loginType");
//   if (loginType === "manual") return;
//   if (status === "loading") return;

//   if (hasCheckedRef.current) return;

//   if (status === "authenticated" && session?.user?.email) {
//     hasCheckedRef.current = true;

//     const redirectPath =
//       localStorage.getItem("postLoginRedirect") || "/";

//     const previewTopicId = localStorage.getItem("previewTopicId");

//     const email = session.user.email;

//     const username = session?.user?.name || "";

// localStorage.setItem("email", email);
//     const checkStudent = async () => {
//       try {
//         const res = await fetch(
//           `https://www.backstagepass.co.in/reactapi/check-student.php?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`,
//           { cache: "no-store" }
//         );

//         const data = await res.json();

//         let finalRedirect = redirectPath;

//         if (data.status === 200) {
//           localStorage.setItem("userId", data.userid);
//           localStorage.setItem("username", data.username);
//           localStorage.setItem("email", data.email);
//           localStorage.setItem("role", data.role);

//           const enrolled = String(data.enrolled).trim();
//           localStorage.setItem("enrolledcourses", enrolled);

//           // ✅ preview has highest priority
//           if (previewTopicId) {
//              //alert('1');
//             finalRedirect = redirectPath;
//           } else if (enrolled) {
//            // alert('2');
//             finalRedirect = "/mycourses";
//           }

//         } else {
//           const user = session.user;
//           if (!user) return;

//           localStorage.setItem("username", user.name ?? "");
//           localStorage.setItem("email", user.email ?? "");
//           localStorage.setItem("image", user.image ?? "");
//           localStorage.setItem("role", "sos");

//           // ✅ preview priority even here
//           if (previewTopicId) {
//              //alert('3');
//             finalRedirect = redirectPath;
//           } else if (redirectPath === "/") {
//             finalRedirect = "/dashboard";
//           }
//         }

//         // ✅ prevent redirect loop
//         if (
//           finalRedirect &&
//           window.location.pathname !== finalRedirect
//         ) {
//           //alert(finalRedirect);
//          safeRedirect(finalRedirect);
          
//         }

//         // ✅ cleanup AFTER redirect decision
//         // localStorage.removeItem("postLoginRedirect");
//         // localStorage.removeItem("previewTopicId");
//         // localStorage.removeItem("loginRedirectDone");

//       } catch (err) {
//         console.error("Login redirect error:", err);
//       }
//     };

//     checkStudent();
//   }
// }, [status, session]);


useEffect(() => {
  const loginType = localStorage.getItem("loginType");

  if (status === "loading") return;

  // ✅ moved up to prevent multiple executions early
  if (hasCheckedRef.current) return;

  if (loginType === "manual") return;

  if (status === "authenticated" && session?.user?.email) {
    hasCheckedRef.current = true; // ✅ lock execution

    const redirectPath =
      localStorage.getItem("postLoginRedirect") || "/";

    const previewTopicId = localStorage.getItem("previewTopicId");

    const email = session.user.email;
    const username = session?.user?.name || "";

    localStorage.setItem("email", email);

    const checkStudent = async () => {
      try {
        const res = await fetch(
          `https://www.backstagepass.co.in/reactapi/check-student.php?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        let finalRedirect = "/dashboard"; // ✅ default fallback

        if (data.status === 200) {
          localStorage.setItem("userId", data.userid);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);
          localStorage.setItem("role", data.role);

          const enrolled = String(data.enrolled).trim();
          localStorage.setItem("enrolledcourses", enrolled);

          // ✅ preview has highest priority
          if (previewTopicId) {
            finalRedirect = redirectPath || "/";
          } else if (enrolled) {
            finalRedirect = "/mycourses";
          }

        } else {
          const user = session.user;
          if (!user) return;

          localStorage.setItem("username", user.name ?? "");
          localStorage.setItem("email", user.email ?? "");
          localStorage.setItem("image", user.image ?? "");
          localStorage.setItem("role", "sos");

          // ✅ preview priority even here
          if (previewTopicId) {
            finalRedirect = redirectPath || "/";
          } else if (redirectPath && redirectPath !== "/") {
            finalRedirect = redirectPath;
          }
        }

        // ✅ prevent redirect loop + double execution
        if (
          finalRedirect &&
          window.location.pathname !== finalRedirect
        ) {
          safeRedirect(finalRedirect);

          // ✅ IMPORTANT: clear after redirect to stop second redirect to dashboard
          localStorage.removeItem("postLoginRedirect");
          localStorage.removeItem("previewTopicId");
        }

      } catch (err) {
        console.error("Login redirect error:", err);
      }
    };

    checkStudent();
  }
}, [status, session]);




  const handleDashboard = () => {
    router.push("/dashboard");
  };


  const { user } = useAuth();

  const role = user?.role;

  const roleLabel = user?.role === "mentor" ? "Mentor Menu" : "Student Menu";

  // console.log("STATUS:", status);
  // console.log("SESSION:", session);

  return (
    <div
      id="navigation"
      className="fixed-top navbar-light bg-faded site-navigation"
    >
      <div className="container">
        <div className="header-wrapper">

          {/* Logo */}
          <div className="site-logo">
            <Link href="/">
              <img
                src="https://backstagepass.co.in/newlogo-324ee245.webp"
                alt="logo"
              />
            </Link>
          </div>

          {/* Right Side Button */}
          <div className="call_to_action">
            {status === "loading" ? null :
              (status === "authenticated" || localStorage.getItem("email")) ? (
                <UserDropdown />
              ) : (
                <button className="btn_one" onClick={handleSigninClick}>
                  Login
                </button>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppHeader;
