import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

// Recruiter: form to post a new job.
export default function PostJob() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });

  // we need the recruiter's companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/company/get");
        if (res.data.success) setCompanies(res.data.companies);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // this route takes normal JSON (no file), requirements is a comma separated string
      const res = await api.post("/job/post", input);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not post job");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-md";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6">Post New Job</h1>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Title</label>
            <input name="title" value={input.title} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <input name="description" value={input.description} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Requirements (comma separated)</label>
            <input name="requirements" value={input.requirements} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Salary (LPA)</label>
            <input type="number" name="salary" value={input.salary} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <input name="location" value={input.location} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Job Type</label>
            <input name="jobType" value={input.jobType} onChange={handleChange} placeholder="Full Time, Remote..." required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">Experience Level (years)</label>
            <input type="number" name="experience" value={input.experience} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="block mb-1">No. of Positions</label>
            <input type="number" name="position" min="1" value={input.position} onChange={handleChange} required className={inputClass} />
          </div>
        </div>

        <label className="block mb-1">Company</label>
        <select name="companyId" value={input.companyId} onChange={handleChange} required className={`${inputClass} mb-6`}>
          <option value="">Select a company</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {companies.length === 0 && (
          <p className="text-red-600 text-sm mb-4">*Please register a company first, before posting jobs</p>
        )}

        <button
          disabled={loading || companies.length === 0}
          className="w-full py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Please wait..." : "Post New Job"}
        </button>
      </form>
    </div>
  );
}
