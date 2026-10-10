import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, Briefcase, Info, Sun, Moon, ChevronDown, User, LogOut, Building2, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false); // "Me" dropdown
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");

  // add / remove the "dark" class on <html> whenever dark changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    toast.success("Logged out");
    navigate("/");
  };

  // style for the nav links - the active one is darker
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-sm ${
      isActive ? "text-slate-900 dark:text-white font-medium" : "text-slate-500"
    } hover:text-brand`;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <Link2 className="text-brand" size={32} />
          InternLink
        </Link>

        {/* middle links */}
        <div className="hidden md:flex items-center gap-10">
          {/* recruiters see different links than students */}
          {user?.role === "recruiter" ? (
            <>
              <NavLink to="/admin/companies" className={linkClass}>
                <Building2 size={20} /> Companies
              </NavLink>
              <NavLink to="/admin/jobs" className={linkClass}>
                <Briefcase size={20} /> Jobs
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" end className={linkClass}>
                <Home size={20} /> Home
              </NavLink>
              <NavLink to="/jobs" className={linkClass}>
                <Briefcase size={20} /> Jobs
              </NavLink>
            </>
          )}
          <NavLink to="/about" className={linkClass}>
            <Info size={20} /> About us
          </NavLink>

          {/* "Me" dropdown only when logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col items-center text-sm text-slate-500 hover:text-brand cursor-pointer"
              >
                <img
                  src={user.profile?.profilePhoto || "https://placehold.co/40x40?text=U"}
                  alt="me"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="flex items-center">
                  Me <ChevronDown size={14} />
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-xs text-slate-500 mb-3 truncate">{user.profile?.bio || user.email}</p>
                  {user.role === "student" && (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 py-2 hover:text-brand"
                    >
                      <User size={16} /> View Profile
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 hover:text-brand cursor-pointer"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* right side buttons */}
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-brand font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Join now
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-brand text-white font-medium hover:bg-brand-dark"
              >
                Sign up
              </Link>
            </>
          )}
          {/* dark / light toggle */}
          <button onClick={() => setDark(!dark)} className="cursor-pointer" aria-label="toggle theme">
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
