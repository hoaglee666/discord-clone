"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { Button } from "./ui/button";
import "@uploadthing/react/styles.css";

//import "@uploadthing/react/styles.css";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "serverImage" | "messageFile";
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();
     
    if (value && fileType !== "pdf") {
        return (
            <div className="relative w-20 h-20">
                <Image fill src={value} alt="Upload" className="rounded-full" />
                <button onClick={() => onChange()} className="absolute top-0 right-0 p-1 bg-rose-500 rounded-full shadow-sm">
                    <X className="h-4 w-4"/>    
                </button>
            </div>
        );
    }

    return (<UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
                //alert("Upload Completed");
            }
        }
        onUploadError={(err) => {
            console.log(err);
        }}
    />);
};

