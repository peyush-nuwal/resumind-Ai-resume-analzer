import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  companyName,
  jobTitle,
  imagePath,
  id,
  feedback,
}: Resume & { feedback: Feedback }) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>();

  useEffect(() => {
    const fetchResumes = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    fetchResumes();
  }, [imagePath]);
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in  duration-1000"
    >
      {/* ---resume-card-header --- */}
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500 ">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h3 className=" font-bold !text-black ">Resume</h3>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>
      {/* ---resume-card-image --- */}
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 ">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={jobTitle}
              className="w-full h-[350px] max-sm:h-[20px] object-cover"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
