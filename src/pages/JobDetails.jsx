import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils";

export default function JobDetails() {
  const { id } = useParams(); // job id from the url
  const { user, saveUser } = useAuth();

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);

  // states for the "upload resume" popup
  const [open, setOpen] = useState(false); // is the popup open?
  const [resumeFile, setResumeFile] = useState(null); // the resume the student selected
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/job/get/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
          // job.applications is a list of applications, so we check
          // if any of them belongs to the logged in user
          setIsApplied(res.data.job.applications.some((app) => app.applicant === user._id));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load job");
      }
    };
    fetchJob();
  }, [id, user._id]);

  // when the student picks a file in the popup
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // the server stores the resume on cloud storage, so only PDF files are allowed
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // jpg files have the type image/jpeg
if (!allowedTypes.includes(file.type)) {
  e.target.value = ""; // clear the box
  setResumeFile(null);
  return toast.error("Please upload your resume as a PDF, JPG or PNG file");
}
    // keep the file small (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      setResumeFile(null);
      return toast.error("Resume should be less than 5 MB");
    }
    setResumeFile(file);
  };

  // runs when the student clicks "Upload & Apply" in the popup
  const applyHandler = async (e) => {
    e.preventDefault();

    // resume is compulsory before applying
    if (!resumeFile) {
      return toast.error("Please upload your resume first");
    }

    try {
      setLoading(true);

      // STEP 1: upload the resume.
      // The backend saves the resume in the student's profile (profile update route),
      // the other fields are not sent so they stay as they were.
      const formData = new FormData();
      formData.append("file", resumeFile);
      const upload = await api.post("/user/profile/update", formData);
      if (!upload.data.success) return;
      saveUser(upload.data.user); // keep the new resume in our saved user

      // STEP 2: apply for the job (same as before)
      const res = await api.get(`/application/apply/${id}`);
      if (res.data.success) {
        setIsApplied(true);
        // add 1 to the applicants count on screen without reloading
        setJob({ ...job, applications: [...job.applications, { applicant: user._id }] });
        toast.success(res.data.message);
        setOpen(false);
        setResumeFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not apply");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p className="p-10">Loading...</p>;

  // small helper to show one row of details
  const Row = ({ label, value }) => (
    <p className="mb-3">
      <span className="font-bold">{label}: </span>
      <span className="text-slate-600 dark:text-slate-300">{value}</span>
    </p>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-3">{job.title}</h1>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">{job.position} Positions</span>
            <span className="px-2 py-1 rounded-full bg-red-50 text-red-600">{job.jobType}</span>
            <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700">{job.salary} LPA</span>
          </div>
        </div>

        {/* only students can apply */}
        {user.role === "student" && (
          <button
            onClick={isApplied ? undefined : () => setOpen(true)}
            disabled={isApplied}
            className={`px-6 py-2 rounded-full text-white font-medium ${
              isApplied ? "bg-slate-400 cursor-not-allowed" : "bg-brand hover:bg-brand-dark cursor-pointer"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold border-b border-slate-300 pb-2 mb-4">Job Description</h2>
      <Row label="Role" value={job.title} />
      <Row label="Location" value={job.location} />
      <Row label="Description" value={job.description} />
      <Row label="Requirements" value={job.requirements.join(", ")} />
      <Row label="Experience" value={`${job.experienceLevel} yrs`} />
      <Row label="Salary" value={`${job.salary} LPA`} />
      <Row label="Total Applicants" value={job.applications.length} />
      <Row label="Posted Date" value={formatDate(job.createdAt)} />

      {/* ----- upload resume popup (opens when "Apply Now" is clicked) ----- */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={applyHandler} className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-1">Upload your resume</h2>
            <p className="text-sm text-slate-500 mb-4">
              To apply for <span className="font-semibold">{job.title}</span> please upload your resume first.
            </p>

            {/* show the resume that is already in the profile (it will be replaced) */}
            {user.profile?.resumeOriginalName && (
              <p className="text-xs text-slate-500 mb-3">
                Current resume: {user.profile.resumeOriginalName} (the new file will replace it)
              </p>
            )}

            <label className="block text-sm mb-1">Resume (Upload file, max 5 MB) *</label>
            <input
              type="file"
          accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
              onChange={handleFile}
              className="mb-2 text-sm block w-full"
            />
            {resumeFile && <p className="text-xs text-green-600 mb-4">Selected: {resumeFile.name}</p>}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setResumeFile(null);
                }}
                disabled={loading}
                className="flex-1 py-2 border border-slate-300 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                className="flex-1 py-2 bg-brand text-white rounded-md hover:bg-brand-dark disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Applying..." : "Upload & Apply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
