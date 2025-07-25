import { prepareInstructions } from "constant";
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";


// Upload page component
const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate()
 

  const handleFileSelect = (file:File|null)=>{
    setFile(file)
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => { 
    setIsProcessing(true)
    setStatusText("uploading the file ...")
    try {
      const uploadFile = await fs.upload([file])
      if(!uploadFile) return setStatusText("failed to upload the file")
      setStatusText("Converting to Image")
      
      const imageFile = await convertPdfToImage(file)
      
      if (!imageFile.file) return setStatusText("failed to convert to image")
      setStatusText("uploading the image ...")
      const uploadImage = await fs.upload([imageFile.file])
      if(!uploadImage) return setStatusText("failed to upload the image")
      setStatusText("uploading the image to the database ...")
      const uuid = generateUUID();
      const data = {
        id: uuid,
        resumePath: uploadFile.path,
        imagePath: uploadImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      }
      const result = await kv.set(`resume:${uuid}`, JSON.stringify(data))
      setStatusText("Analyzing the resume ...")
      
      const feedback= await ai.feedback(uploadFile.path,prepareInstructions({jobTitle, jobDescription}) )
      
      if(!feedback) return setStatusText("failed to analyze the resume")
      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;
        
      data.feedback = JSON.parse(feedbackText);

      await kv.set(`resume:${uuid}`, JSON.stringify(data))
      setStatusText("Analyzed successfully")
      console.log(data)
      navigate(`/resume/${uuid}`)
      
   }catch(error){
    console.log(error)
   }

  }
   
  // Handler for form submission (currently empty, needs implementation)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string; 

    if(!file) return;
 console.log(companyName, jobTitle, jobDescription, file);
     handleAnalyze({companyName, jobTitle, jobDescription, file})
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      {/* ---home page section --- */}
      <section className="main-section ">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {/* Show processing status and animation if isProcessing is true */}
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="scan-gif"
                className="w-full"
              />
            </>
          ) : (
            // Show instructions if not processing
            <h2>Drop your resume for an ATS score and improvement tips</h2>
            // ---form will be rendered below if not processing---
          )}
          {/* Render the form only if not processing */}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              {/* Company Name input */}
              <div className="form-div">
                <label htmlFor="company-name">Company name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              {/* Job Title input */}
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Job Title"
                  id="job-title"
                />
              </div>
              {/* Job Description textarea */}
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Job Description"
                  id="job-description"
                />
              </div>
              {/* Resume Upload input */}
              <div className="form-div">
              
                <div className="form-div">
                  <label htmlFor="uploader">Upload Resume</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>
              </div>
              {/* Submit button */}
              <button className="primary-button" type="submit">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
