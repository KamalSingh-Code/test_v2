import { useEffect, useState } from "react";
import { Pen, Mail, Contact } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils";

export default function Profile() {
  const { user, saveUser } = useAuth();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [open, setOpen] = useState(false); // is the edit popup open?
  const [loading, setLoading] = useState(false);

  // form values start with the current user data
  const [input, setInput] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bio: user.profile?.bio || "",
    skills: user.profile?.skills?.join(", ") || "",
    file: null,
  });

  // get the jobs this student applied for
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const res = await api.get("/application/get");
        if (res.data.success) setAppliedJobs(res.data.application);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApplied();
  }, []);

  const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (String(input.phoneNumber).length !== 10) return toast.error("Phone number must be 10 digits");

    // backend always uploads a file (resume) to cloudinary, so it is required
    if (!input.file) return toast.error("Please select your resume file");

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills); // backend splits this by comma
    formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await api.post("/user/profile/update", formData);
      if (res.data.success) {
        saveUser(res.data.user); // update the user everywhere
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-2 mb-3 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 rounded-md";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ----- profile card ----- */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 mb-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user.profile?.profilePhoto || "https://placehold.co/80x80?text=U"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-slate-500">{user.profile?.bio || "No bio added yet"}</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="h-fit p-2 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Pen size={16} />
          </button>
        </div>

        <div className="my-5 space-y-2">
          <p className="flex items-center gap-3"><Mail size={18} /> {user.email}</p>
          <p className="flex items-center gap-3"><Contact size={18} /> {user.phoneNumber}</p>
        </div>

        <h2 className="font-bold mb-2">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {user.profile?.skills?.length > 0 ? (
            user.profile.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-slate-800 text-white text-sm">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-slate-500">NA</span>
          )}
        </div>

        <h2 className="font-bold mb-1">Resume</h2>
        {user.profile?.resume ? (
          <a href={user.profile.resume} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {user.profile.resumeOriginalName}
          </a>
        ) : (
          <span className="text-slate-500">NA</span>
        )}
      </div>

      {/* ----- applied jobs table ----- */}
      <h2 className="text-xl font-bold mb-3">Applied Jobs</h2>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Job Role</th>
              <th className="p-3">Company</th>
              <th className="p-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  You haven't applied for any job yet
                </td>
              </tr>
            ) : (
              appliedJobs.map((item) => (
                <tr key={item._id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="p-3">{formatDate(item.createdAt)}</td>
                  <td className="p-3">{item.job?.title}</td>
                  <td className="p-3">{item.job?.company?.name}</td>
                  <td className="p-3 text-right">
                    {/* color of the badge depends on the status */}
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm capitalize ${
                        item.status === "rejected"
                          ? "bg-red-500"
                          : item.status === "accepted"
                          ? "bg-green-500"
                          : "bg-slate-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ----- edit profile popup ----- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>

            <label className="block text-sm mb-1">Name</label>
            <input name="fullName" value={input.fullName} onChange={handleChange} className={inputClass} />

            <label className="block text-sm mb-1">Email</label>
            <input name="email" value={input.email} onChange={handleChange} className={inputClass} />

            <label className="block text-sm mb-1">Phone Number</label>
            <input
              inputMode="numeric"
              maxLength={10}
              value={input.phoneNumber}
              onChange={(e) => setInput({ ...input, phoneNumber: e.target.value.replace(/\D/g, "") })}
              className={inputClass}
            />

            <label className="block text-sm mb-1">Bio</label>
            <input name="bio" value={input.bio} onChange={handleChange} className={inputClass} />

            <label className="block text-sm mb-1">Skills (separate with commas)</label>
            <input name="skills" value={input.skills} onChange={handleChange} className={inputClass} />

            <label className="block text-sm mb-1">Resume</label>
            <input
              type="file"
              onChange={(e) => setInput({ ...input, file: e.target.files[0] })}
              className="mb-5 text-sm block"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2 border border-slate-300 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="flex-1 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
