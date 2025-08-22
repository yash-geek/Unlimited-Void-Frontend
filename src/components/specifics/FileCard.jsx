import React from "react"
import OptionsMenu from "./OptionsMenu"

const FileCard = ({ file, onDelete, onDownload, onRestore, actions = [] }) => {
  const isImage = file.type?.startsWith("image/")
  const isVideo = file.type?.startsWith("video/")
  const isAudio = file.type?.startsWith("audio/")
  const isDoc =
    file.type?.includes("pdf") ||
    file.type?.includes("word") ||
    file.type?.includes("text") ||
    file.type?.includes("msword") ||
    file.type?.includes("officedocument")

  return (
    <div className="p-4 bg-white shadow rounded flex flex-col items-center text-center hover:shadow-lg transition relative ">
      <OptionsMenu
        isFile={true}
        fileId={file.id}
        onDelete={onDelete}
        onDownload={onDownload}
        onRestore={onRestore}
        actions={actions}
      />


      <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded mb-2">
        {isImage ? (
          <img src={file.path} alt={file.name} className="object-cover h-full w-fit" />
        ) : isVideo ? (
          <video src={file.path} controls className="object-cover w-full h-full" />
        ) : isAudio ? (
          <audio controls className="w-full">
            <source src={file.path} type={file.type} />
          </audio>
        ) : isDoc ? (
          <a href={file.path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            📄 Open Document
          </a>
        ) : (
          <a href={file.path} target="_blank" rel="noopener noreferrer" className="text-gray-600">
            📦 {file.name}
          </a>
        )}
      </div>
      <p className="text-sm truncate w-full">{file.name}</p>
    </div>
  )
}

export default FileCard
