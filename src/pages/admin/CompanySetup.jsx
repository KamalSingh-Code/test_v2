import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

// Step 2: edit company details + upload logo.
export default function CompanySetup() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({ name: "", description: "", website: "", location: "", file: null });
  const [loading, setLoading] = useState(false);

  // load the current company data and fill the form
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/company/get/${id}`);
        if (res.data.success) {
          const c = res.data.company;
          setInput({
            name: c.name || "",
            description: c.description || "",
            website: c.website || "",
            location: c.location || "",
            file: null,
          });
        }
      } catch (error) {
        toast.error("Could not load company");
      }
    };
    fetchCompany();
  }, [id]);

  const handleChange = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend uploads the logo to cloudinary every time, so it is required
    if (!input.file) return toast.error("Please select a logo");

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("website", input.website);
    formData.append("location", input.location);
    formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await api.put(`/company/update/${id}`, formData);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-2 mb-4 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-md";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold mb-6">Company Setup</h1>

        <label className="block mb-1">Company Name</label>
        <input name="name" value={input.name} onChange={handleChange} className={inputClass} />

        <label className="block mb-1">Description</label>
        <input name="description" value={input.description} onChange={handleChange} className={inputClass} />

        <label className="block mb-1">Website</label>
        <input name="website" value={input.website} onChange={handleChange} className={inputClass} />

        <label className="block mb-1">Location</label>
        <input name="location" value={input.location} onChange={handleChange} className={inputClass} />

        <label className="block mb-1">Logo</label>
        <input type="file" accept="image/*" onChange={(e) => setInput({ ...input, file: e.target.files[0] })} className="block mb-6 text-sm" />

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate("/admin/companies")} className="px-5 py-2 border border-slate-300 rounded-md cursor-pointer">
            Back
          </button>
          <button disabled={loading} className="flex-1 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60 cursor-pointer">
            {loading ? "Please wait..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
