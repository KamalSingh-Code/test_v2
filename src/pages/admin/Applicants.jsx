import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api";
import { formatDate } from "../../utils";

// Recruiter: see who applied for one job, and accept / reject them.
export default function Applicants() {
  const { id } = useParams(); // job id
  const [job, setJob] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/application/${id}/applicants`);
      if (res.data.success) setJob(res.data.job);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load applicants");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  // status is "accepted" or "rejected"
  const statusHandler = async (status, applicationId) => {
    try {
      const res = await api.post(`/application/status/${applicationId}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchApplicants(); // reload so the new status shows
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status");
    }
  };

  if (!job) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">Applicants ({job.applications.length})</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Resume</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {job.applications.map((app) => (
              <tr key={app._id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{app.applicant?.fullName}</td>
                <td className="p-3">{app.applicant?.email}</td>
                <td className="p-3">{app.applicant?.phoneNumber}</td>
                <td className="p-3">
                  {app.applicant?.profile?.resume ? (
                    <a href={app.applicant.profile.resume} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      {app.applicant.profile.resumeOriginalName}
                    </a>
                  ) : (
                    "NA"
                  )}
                </td>
                <td className="p-3">{formatDate(app.createdAt)}</td>
                {/* status badge - color changes with the status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm capitalize ${
                      app.status === "accepted"
                        ? "bg-green-500"
                        : app.status === "rejected"
                        ? "bg-red-500"
                        : "bg-slate-500"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="p-3">
                  {/* the buttons are shown ONLY while the application is still pending.
                      Once it is accepted or rejected the decision is final, so we show a dash. */}
                  {app.status === "pending" ? (
                    <div className="flex gap-2">
                      <button onClick={() => statusHandler("accepted", app._id)} className="px-3 py-1 rounded bg-green-500 text-white text-sm cursor-pointer">
                        Accept
                      </button>
                      <button onClick={() => statusHandler("rejected", app._id)} className="px-3 py-1 rounded bg-red-500 text-white text-sm cursor-pointer">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
