import { Link } from "react-router-dom";
import WhyChoose from "../components/WhyChoose";
import Footer from "../components/Footer";

// Home page = hero (centered) + "why choose us" cards + footer
export default function Home() {
  return (
    <div>
      {/* ---------- hero section ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-100 via-slate-50 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
        {/* two soft round blobs in the background just for the look */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/20 blur-3xl"></div>
        <div className="absolute top-40 -right-24 w-96 h-96 rounded-full bg-cyan-300/30 blur-3xl"></div>

        {/* everything inside is centered with text-center + items-center */}
        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Work Smarter, <span className="text-brand">Together</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl">
            Connecting students and graduates with internships and entry-level jobs — find
            opportunities and build your career.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              to="/jobs"
              className="px-8 py-4 rounded-full bg-brand text-white text-lg font-medium shadow-lg hover:bg-brand-dark"
            >
              Explore Opportunities
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-full border border-brand text-brand text-lg font-medium hover:bg-white dark:hover:bg-slate-800"
            >
              Learn More
            </Link>
          </div>

          
          {/* optional illustration: put your image in the "public" folder as hero.png.
              If the file is missing, the image just hides itself. */}
          <img
            src="/hero.png"
            alt="hero"
            className="mt-14 max-w-full w-[600px]"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </section>

      {/* ---------- why choose us ---------- */}
      <WhyChoose />

      {/* ---------- footer ---------- */}
      <Footer />
    </div>
  );
}
