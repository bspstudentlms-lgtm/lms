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
    window.location.replace(path);
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

  return (
//     <header className="sticky top-0 flex w-full bg-white border-gray-200 z-9 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
//       <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
// <div className="flex items-center gap-5">

//   {/* Sidebar Toggle (Only if NOT Home) */}
//   {/* {pathname !== "/" && (
//     <button
//       className="flex items-center justify-center w-11 h-11 border border-gray-200 rounded-lg text-gray-600 dark:border-gray-700"
//       onClick={handleToggle}
//       aria-label="Toggle Sidebar"
//     >
//       <svg
//         width="18"
//         height="14"
//         viewBox="0 0 16 12"
//         fill="none"
//       >
//         <path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75H1.33325Z"
//           fill="currentColor"
//         />
//       </svg>
//     </button>
//   )} */}

//   {/* Logo ALWAYS Visible */}
//   <Link href="/" className="flex items-center">
//     <Image
//       src="https://backstagepass.co.in/newlogo-324ee245.webp"
//       alt="Logo"
//       width={220}
//       height={70}
//       priority
//       className="object-contain"
//     />
//   </Link>

// </div>



//         <div
//           className={`${
//             isApplicationMenuOpen ? "flex" : "hidden"
//           } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
//         style={{    justifyContent: "right"}}>
//           {/* <div className="flex items-center gap-2 2xsm:gap-3">
//             <ThemeToggleButton />
//           </div> */}

         
//           {status === "authenticated" ? (
//             <>
//               {isMobileOpen && <div>WELCOME</div>}
//               <UserDropdown />
//             </>
//           ) : (
//             <button
//               className="px-6 py-2 border bg-red-500 text-white rounded-md hover:bg-red-600"
//               onClick={handleSigninClick}
//             >
//               Login
//             </button>
//           )}

//         </div>
//       </div>
//     </header>

    <div
          id="navigation"
          className="fixed-top navbar-light bg-faded site-navigation"
        >
          <div className="container">
            <div className="row dfm">
              <div className="col-lg-3 col-md-3 col-sm-4 dfa">
                <div className="site-logo">
                  <Link href="/">
                    <img
                      src="https://backstagepass.co.in/newlogo-324ee245.webp"
                      alt="logo"
                    />
                  </Link>
                </div>
              </div>
    
              <div className="col-lg-4 col-md-3 col-sm-8">
                <div className="dfe">
                  <div className="home_lc">
                    <Link href="#" className="hlc">
                      <i className="ti-heart"></i>
                      <span className="gactive">0</span>
                    </Link>
                  </div>
    
                  <div className="call_to_action">
                    {status === "loading" ? null : session ? (
                      <button
                        className="btn_one"
                        onClick={handleDashboard}
                      >
                        Dashboard
                      </button>
                    ) : (
                      <button
                        className="btn_one"
                        onClick={handleSigninClick}
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
  );
};

export default AppHeader;
