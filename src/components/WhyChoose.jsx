import { Target, Link2, Zap, TrendingUp } from "lucide-react";

// The 4 cards are stored in an array, then we .map() over it.
// This way we don't have to write the same card 4 times.
const features = [
  {
    icon: Target,
    title: "Made for Students",
    text: "Jobs and internships curated for your level, no impossible requirements",
  },
  {
    icon: Link2,
    title: "Direct Recruiter Connection",
    text: "Communicate directly with recruiters to increase your chances of landing the job",
  },
  {
    icon: Zap,
    title: "One Profile to Apply Everywhere",
    text: "Create a single profile and use it to apply to multiple jobs with ease",
  },
  {
    icon: TrendingUp,
    title: "Track Your Application Status",
    text: "Stay updated on your application progress all in one place",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-20 px-6">
      <h2 className="text-4xl font-bold text-brand text-center mb-16">Why Choose InternLink?</h2>

      {/* 1 column on mobile, 2 columns on bigger screens */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {features.map((item) => {
          const Icon = item.icon; // component name must start with a capital letter
          return (
            <div
              key={item.title}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-8 min-h-56 flex flex-col"
            >
              <Icon size={30} className="text-cyan-900 dark:text-cyan-300 mb-8" />
              <h3 className="text-2xl font-bold text-brand mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
