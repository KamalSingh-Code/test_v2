import { useNavigate } from "react-router-dom";
import { daysAgo } from "../utils";

// One job box shown on the Jobs page.
export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5 border border-slate-100 dark:border-slate-700 flex flex-col">
      <p className="text-xs text-slate-500">{daysAgo(job.createdAt)}</p>

      {/* company logo + name */}
      <div className="flex items-center gap-3 my-3">
        <img
          src={job.company?.logo || "https://placehold.co/48x48?text=Co"}
          alt="logo"
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <h2 className="font-semibold">{job.company?.name}</h2>
          <p className="text-xs text-slate-500">{job.location}</p>
        </div>
      </div>

      <h1 className="font-bold text-lg">{job.title}</h1>
      {/* line-clamp-3 cuts the description after 3 lines */}
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-3">{job.description}</p>

      {/* small tags */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">{job.position} Positions</span>
        <span className="px-2 py-1 rounded-full bg-red-50 text-red-600">{job.jobType}</span>
        <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700">{job.salary} LPA</span>
      </div>

      <button
        onClick={() => navigate(`/jobs/${job._id}`)}
        className="mt-auto py-2 rounded-full border border-brand text-brand hover:bg-brand hover:text-white cursor-pointer"
      >
        Details
      </button>
    </div>
  );
}
