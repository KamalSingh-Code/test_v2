// Simple static page, no backend needed.
export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">About InternLink</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
        InternLink connects students and graduates with internships and entry-level jobs. Students can
        search and apply for jobs, and recruiters can register their companies, post jobs and manage
        applicants.
      </p>
      <p className="text-lg text-slate-600 dark:text-slate-300">
        This project was built using React and Tailwind CSS on the front end, with Node, Express and
        MongoDB on the back end.
      </p>
    </div>
  );
}
