"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SiteNavigation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/signin");
  };

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
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
              {/* <div className="home_lc">
                <Link href="#" className="hlc">
                  <i className="ti-heart"></i>
                  <span className="gactive">0</span>
                </Link>
              </div> */}

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
                    onClick={handleLogin}
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

export default SiteNavigation;
