import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";

// Step 1 of adding a company: just the name.
// After this we send the recruiter to the edit page to fill other details.
export default function CompanyCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Enter a company name");
    try {
      const res = await api.post("/company/register", { name });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/admin/companies/${res.data.company._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create company");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Your Company Name</h1>
      <p className="text-slate-500 mb-6">What would you like to name your company? You can change it later.</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="JobHunt, Microsoft etc."
        className="w-full p-2 mb-6 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-md"
      />

      <div className="flex gap-3">
        <button onClick={() => navigate("/admin/companies")} className="px-5 py-2 border border-slate-300 rounded-md cursor-pointer">
          Cancel
        </button>
        <button onClick={handleCreate} className="px-5 py-2 bg-brand text-white rounded-md hover:bg-brand-dark cursor-pointer">
          Continue
        </button>
      </div>
    </div>
  );
}
