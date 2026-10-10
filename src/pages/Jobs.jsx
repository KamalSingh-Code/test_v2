import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import JobCard from "../components/JobCard";

// The backend job model does NOT have a "category" field, so I made a small
// list of keywords for each category. A job is matched if its title or
// description contains one of these words.
const categories = {
  "Technology & IT": ["developer", "software", "frontend", "backend", "full stack", "react", "node", "web", "data", "it support", "devops"],
  "Design & Creative": ["design", "ui", "ux", "graphic", "creative", "animator", "video"],
  "Business & Management": ["business", "manager", "management", "operations", "analyst", "consultant"],
  "Marketing & Sales": ["marketing", "sales", "seo", "social media", "brand"],
  "Finance & Accounting": ["finance", "accountant", "accounting", "audit", "tax", "bank"],
  "Human Resources": ["hr", "human resource", "recruiter", "talent", "hiring"],
  Engineering: ["engineer", "mechanical", "civil", "electrical", "electronics"],
  "Science & Healthcare": ["science", "healthcare", "doctor", "nurse", "medical", "research", "pharma"],
};

const jobTypes = ["Remote", "Full Time", "Part Time", "Internship", "Contract"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]); // all jobs from backend
  const [loading, setLoading] = useState(true);

  // filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(""); // only one category at a time
  const [types, setTypes] = useState([]); // many job types can be ticked

  // footer links look like /jobs?type=Remote, so we read "type" from the url
  // and tick that checkbox automatically
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const typeFromUrl = searchParams.get("type");
    setTypes(typeFromUrl ? [typeFromUrl] : []);
  }, [searchParams]);

  // get all jobs once when the page opens
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/job/get");
        if (res.data.success) setJobs(res.data.jobs);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // tick / untick a job type checkbox
  const toggleType = (type) => {
    if (types.includes(type)) {
      setTypes(types.filter((t) => t !== type)); // remove it
    } else {
      setTypes([...types, type]); // add it
    }
  };

  // apply all the filters on the jobs list
  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.description}`.toLowerCase();

    // 1. search by title or company name
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(search.toLowerCase());

    // 2. category (if one is selected)
    const matchCategory = !category || categories[category].some((word) => text.includes(word));

    // 3. job type (if any ticked) - "Remote" also checks the location
    const matchType =
      types.length === 0 ||
      types.some(
        (t) =>
          job.jobType.toLowerCase().includes(t.toLowerCase()) ||
          (t === "Remote" && job.location.toLowerCase().includes("remote"))
      );

    return matchSearch && matchCategory && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* ---------- left filter sidebar ---------- */}
      <aside className="md:w-80 shrink-0 bg-cyan-50 dark:bg-slate-800 rounded-2xl p-5 h-fit shadow">
        <h2 className="text-2xl font-bold text-center pb-3 mb-4 border-b border-slate-200 dark:border-slate-600">
          Filter Jobs
        </h2>

        {/* search box */}
        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-3 mb-4">
          <h3 className="font-semibold mb-2">Search By Job Title</h3>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg px-3 py-2">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job Title or Company"
              className="outline-none w-full bg-transparent text-sm"
            />
          </div>
        </div>

        {/* category buttons */}
        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-3 mb-4">
          <h3 className="font-semibold mb-2">▼ Category</h3>
          <div className="max-h-80 overflow-y-auto flex flex-col gap-2 pr-2">
            {Object.keys(categories).map((cat) => (
              <button
                key={cat}
                // clicking the selected category again removes the filter
                onClick={() => setCategory(category === cat ? "" : cat)}
                className={`py-2 rounded text-white font-medium cursor-pointer ${
                  category === cat ? "bg-slate-800" : "bg-brand hover:bg-brand-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* job type checkboxes */}
        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-3">
          <h3 className="font-semibold mb-2">Job Type</h3>
          {jobTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 py-1 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={types.includes(type)}
                onChange={() => toggleType(type)}
                className="w-4 h-4 accent-teal-600"
              />
              {type}
            </label>
          ))}
        </div>
      </aside>

      {/* ---------- right side: jobs ---------- */}
      <main className="flex-1">
        {loading ? (
          <p>Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-slate-500">No jobs found</p>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
