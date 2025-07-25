import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { formatBytes } from "~/lib/utils";
interface fileUploaderProps {
    onFileSelect?:(file:File|null)=>void ; 
}

const FileUploader = ({onFileSelect}:fileUploaderProps) => {

  
     const onDrop = useCallback((acceptedFiles:File[]) => {
       const file = acceptedFiles[0] || null
       onFileSelect?.(file)
     }, [onFileSelect]);
     const { getRootProps, getInputProps, isDragActive,acceptedFiles } = useDropzone({
       onDrop,
       multiple:false,
       accept:{
         'application/pdf': [".pdf"]
       },
       maxSize:20*1024*1024,
     });
  const file = acceptedFiles[0] || null;



  
  return (
    <div className="w-full gradient-border">
      {" "}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="uploader-selected-file"
            >
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center  space-x-3">
                <div>
                  <p className="max-w-xs text-sm text-gray-700 font-medium truncate ">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500 ">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button onClick={()=>onFileSelect?.(null)}  className="p-2 cursor-pointer" > <img src="/icons/cross.svg" alt="close" className="size-4"/></button>
            </div>
          ) : (
            <div>
              <div className="mx-auto size-16 flex items-center justify-center">
                <img src="/icons/info.svg" alt="upload" className="size-20" />
              </div>
              <p className="text-lg text-gray-500 ">
                <span className="font-semibold">Click here to upload</span> or
                drag and drop
              </p>
              <p className="text-lg text-gray-500 ">PDG(Max 20MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default FileUploader