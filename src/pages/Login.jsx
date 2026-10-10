import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { saveUser } = useAuth();

  // one state object for the whole form
  const [input, setInput] = useState({ email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);

  // runs on every key press, updates only the field that changed
  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading
    try {
      setLoading(true);
      const res = await api.post("/user/login", input);
      if (res.data.success) {
        saveUser(res.data.user);
        toast.success(res.data.message);
        // recruiters go to their dashboard, students go to jobs
        navigate(res.data.user.role === "recruiter" ? "/admin/companies" : "/jobs");
      }
    } catch (error) {
      // backend sends the error text in error.response.data.message
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={input.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
          className="w-full mb-4 p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-md"
        />

        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={input.password}
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-md"
        />

        {/* role radio buttons (backend needs the role while logging in) */}
        <div className="flex gap-6 mb-6">
          {["student", "recruiter"].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer capitalize">
              <input type="radio" name="role" value={r} checked={input.role === r} onChange={handleChange} />
              {r}
            </label>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-brand font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
