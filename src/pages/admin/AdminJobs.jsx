import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";
import { formatDate } from "../../utils";

// Recruiter: all jobs they have posted.
export default function AdminJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/job/getadminjobs");
        if (res.data.success) setJobs(res.data.jobs);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load jobs");
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, role"
          className="p-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-800 rounded-md w-64"
        />
        <button
          onClick={() => navigate("/admin/jobs/create")}
          className="px-5 py-2 bg-brand text-white rounded-md hover:bg-brand-dark cursor-pointer"
        >
          New Job
        </button>
      </div>

      <table className="w-full text-left bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-700">
          <tr>
            <th className="p-3">Company</th>
            <th className="p-3">Role</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-slate-500">No jobs posted yet</td>
            </tr>
          ) : (
            filtered.map((job) => (
              <tr key={job._id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{job.company?.name}</td>
                <td className="p-3">{job.title}</td>
                <td className="p-3">{formatDate(job.createdAt)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                    className="text-brand font-medium cursor-pointer"
                  >
                    Applicants
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
