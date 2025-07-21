import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constant";
import ResumeCard from "~/components/ResumeCard";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your resume!" },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      {/* ---home page section --- */}
      <section className="main-section py-16">
        {/* ---home page heading --- */}
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>
            Review your submissions and get Ai-powered feedback on your resume
          </h2>
        </div>
        {/* --- render some resumes --- */}
        {resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
