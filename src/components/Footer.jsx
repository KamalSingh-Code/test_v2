import { Link } from "react-router-dom";

// Black footer shown at the bottom of the home page.
export default function Footer() {
  // get the current year automatically so we don't have to edit it every year
  const year = new Date().getFullYear();

  const linkClass = "text-slate-300 hover:text-white";

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-14 grid gap-10 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
        {/* column 1 - name + description + copyright */}
        <div>
          <h3 className="text-lg font-bold mb-8">InternLink</h3>
          <p className="text-lg mb-8 max-w-md">
            Connecting students and graduates with internships and entry-level jobs — find
            opportunities and build your career.
          </p>
          <p className="text-slate-400">© Copyright {year} InternLink</p>
        </div>

        {/* column 2 - company links */}
        <div>
          <h3 className="text-lg font-bold mb-8">Company</h3>
          <ul className="space-y-5">
            <li><Link to="/about" className={linkClass}>About Us</Link></li>
            {/* these pages are not made yet, so they are just placeholders (#) */}
            <li><a href="#" className={linkClass}>Our Team</a></li>
            <li><a href="#" className={linkClass}>Blog</a></li>
            <li><a href="#" className={linkClass}>Contact Us</a></li>
          </ul>
        </div>

        {/* column 3 - job categories.
            ?type=... opens the Jobs page with that job type already ticked */}
        <div>
          <h3 className="text-lg font-bold mb-8">Job Categories</h3>
          <ul className="space-y-5">
            <li><Link to="/jobs?type=Internship" className={linkClass}>Internships</Link></li>
            <li><Link to="/jobs" className={linkClass}>Entry-Level Jobs</Link></li>
            <li><Link to="/jobs?type=Remote" className={linkClass}>Remote Jobs</Link></li>
            <li><Link to="/jobs?type=Part Time" className={linkClass}>Part-Time Jobs</Link></li>
          </ul>
        </div>

        {/* column 4 - more info */}
        <div className="flex flex-col items-start">
          <h3 className="text-lg font-bold mb-6">More Information</h3>
          <Link to="/jobs" className="px-5 py-3 rounded-lg bg-brand text-white hover:bg-brand-dark">
            Explore More
          </Link>
          <div className="flex gap-6 mt-auto pt-24">
            <a href="#" className="underline text-slate-300 hover:text-white">Privacy Policy</a>
            <a href="#" className="underline text-slate-300 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
