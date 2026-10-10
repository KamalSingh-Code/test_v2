import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";
import { formatDate } from "../../utils";

// Recruiter: list of companies they registered.
export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/company/get");
        if (res.data.success) setCompanies(res.data.companies);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load companies");
      }
    };
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name"
          className="p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-md w-64"
        />
        <button
          onClick={() => navigate("/admin/companies/create")}
          className="px-5 py-2 bg-brand text-white rounded-md hover:bg-brand-dark cursor-pointer"
        >
          New Company
        </button>
      </div>

      <table className="w-full text-left bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            <th className="p-3">Logo</th>
            <th className="p-3">Name</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-slate-500">No companies registered</td>
            </tr>
          ) : (
            filtered.map((c) => (
              <tr key={c._id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">
                  <img src={c.logo || "https://placehold.co/40x40?text=Co"} alt="logo" className="w-10 h-10 rounded-full object-cover" />
                </td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{formatDate(c.createdAt)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => navigate(`/admin/companies/${c._id}`)}
                    className="text-brand font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
