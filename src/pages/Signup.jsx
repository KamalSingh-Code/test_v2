import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null, // profile photo
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // phone number: remove everything that is not a digit while typing,
  // so letters and symbols can never appear in the box
  const handlePhone = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, ""); // \D means "not a digit"
    setInput({ ...input, phoneNumber: onlyNumbers });
  };

  // file inputs are different, the file is in e.target.files[0]
  const handleFile = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check phone number and password before sending anything to the backend
    if (input.phoneNumber.length !== 10) {
      return toast.error("Phone number must be 10 digits");
    }
    if (input.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    // backend uploads the photo to cloudinary, so a photo is required
    if (!input.file) {
      return toast.error("Please select a profile photo");
    }

    // because we send a file, we need FormData instead of plain JSON
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("file", input.file); // backend multer expects the name "file"

    try {
      setLoading(true);
      const res = await api.post("/user/register", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mb-4 p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-md";

  return (
    <div className="max-w-md mx-auto mt-10 px-4 pb-10">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

        <label className="block mb-1 font-medium">Full Name</label>
        <input name="fullName" value={input.fullName} onChange={handleChange} required className={inputClass} />

        <label className="block mb-1 font-medium">Email</label>
        <input type="email" name="email" value={input.email} onChange={handleChange} required className={inputClass} />

        <label className="block mb-1 font-medium">Phone Number</label>
        <input
          type="tel"
          inputMode="numeric"
          name="phoneNumber"
          value={input.phoneNumber}
          onChange={handlePhone}
          maxLength={10}
          placeholder="10 digit number"
          required
          className={inputClass}
        />

        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={input.password}
          onChange={handleChange}
          minLength={8}
          required
          className={inputClass.replace("mb-4", "mb-1")}
        />
        <p className="text-xs text-slate-500 mb-4">Minimum 8 characters</p>

        <div className="flex gap-6 mb-4">
          {["student", "recruiter"].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer capitalize">
              <input type="radio" name="role" value={r} checked={input.role === r} onChange={handleChange} />
              {r}
            </label>
          ))}
        </div>

        <label className="block mb-1 font-medium">Profile Photo</label>
        <input type="file" accept="image/*" onChange={handleFile} className="mb-6 block text-sm" />

        <button
          disabled={loading}
          className="w-full py-2 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Sign Up"}
        </button>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
