import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";
export function meta() {
  return [
    { title: "Resumind | review" },
    {
      name: "description",
      content:
        "Review your resume and get feedback on your skills and experience.",
    },
  ];
}
const resume = () => {
  const { auth, isLoading, kv, fs } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string>();
  const [resumeUrl, setResumeUrl] = useState<string>();
  const [feedback, setFeedback] = useState<Feedback|null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      console.log(resume);
      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const PdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(PdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageBlobUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageBlobUrl);

      setFeedback(data.feedback);
    };
    fetchResume();
  }, [id]);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="size-2.5" />
          <span className="text-sm font-semibold text-gray-800 ">
            Back to homepage
          </span>
        </Link>
      </nav>
      <div className="w-full flex flex-row max-lg:flex-col-reverse  ">
        <section className=" feedback-section bg-[url('/images/bg-small.svg)] bg-cover h-screen items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="max-sm:m-0 h-[90%] max-2xl:h-fit w-fit  gradient-border animate-in fade-in duration-1000">
              <a href={resumeUrl} target="_blank" download={`${id}.pdf`}>
                <img
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2>Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback } />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback } />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" alt="" className="w-full " />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
