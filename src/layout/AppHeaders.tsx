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

useEffect(() => {
  const loginType = localStorage.getItem("loginType");
  if (loginType === "manual") return;
  if (status === "loading") return;

  if (hasCheckedRef.current) return;
  hasCheckedRef.current = true;

  const redirectPath =
    localStorage.getItem("postLoginRedirect") ||
    window.location.pathname;

    console.log("STATUS:", status);
    console.log("SESSION:", session); 

  if (status === "authenticated" && session?.user?.email) {
    const email = session.user.email;

    const checkStudent = async () => {
      try {
        const res = await fetch(
          `https://www.backstagepass.co.in/reactapi/check-student.php?email=${email}`,
          { cache: "no-store" }
        );

        const data = await res.json();
        
        if (data.status === 200) {
          localStorage.setItem("userId", data.userid);
          localStorage.setItem("username", data.username);
          localStorage.setItem("email", data.email);
          localStorage.setItem("role", data.role);

          const enrolled = String(data.enrolled).trim();
          localStorage.setItem("enrolledcourses", String(enrolled));

          if (enrolled) {
           
            safeRedirect("/mycourses");
          } else {
           
            safeRedirect(redirectPath);
          }
        } else {
          const user = session.user;
          if (!user) return;

          localStorage.setItem("username", user.name ?? "");
          localStorage.setItem("email", user.email ?? "");
          localStorage.setItem("image", user.image ?? "");
          localStorage.setItem("role", "sos");
            if(redirectPath=='/'){
            if (window.location.pathname !== "/dashboard") {
            window.location.replace("/dashboard");
          }
            }else{
            safeRedirect(redirectPath);
            }
        }

        // ✅ VERY IMPORTANT
        localStorage.removeItem("postLoginRedirect");

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

    console.log("STATUS:", status);
    console.log("SESSION:", session); 

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
  <button className="btn_one" onClick={handleDashboard}>
    Dashboard
  </button>
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
