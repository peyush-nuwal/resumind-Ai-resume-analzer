import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your resume!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const fetchResumes = async () => {
      setIsLoading(true);
      const resumes = (await kv.list("resume:*", true)) as unknown as KVItem[];
      if (!resumes) return;
      const parsedResumes = resumes.map((resume) => JSON.parse(resume.value));
      setResumes(parsedResumes);
      setIsLoading(false);
    };
    fetchResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      {/* ---home page section --- */}
      <section className="main-section py-16">
        {/* ---home page heading --- */}
        <div className="page-heading">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!isLoading && resumes.length === 0 ? (
            <h2>No resumes found. upload your resume to get started</h2>
          ) : (
            <h2>
              Review your submissions and get Ai-powered feedback on your resume
            </h2>
          )}
        </div>
        {isLoading && <div className="flex justify-center items-center h-full">
          <img src="/images/resume-scan-2.gif" alt="scaning resumes" className="w-[200px]" />
        </div>}
        {/* --- render some resumes --- */}
        {!isLoading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} {...resume} />
            ))}
          </div>
        )}
        {!isLoading && resumes.length === 0 && (
          <div className="flex justify-center items-center h-full mt-10 gap-4">
             <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
          </div>
        )}
      </section>
    </main>
  );
}
