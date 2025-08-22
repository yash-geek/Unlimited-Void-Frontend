import React, { useState } from "react"
import { useDropzone } from "react-dropzone"
import { useCreateFolderMutation, useUploadFileMutation } from "../../redux/api/api"
import { MdAddCircle, MdUploadFile } from "react-icons/md"

const NewUploader = ({ folderId }) => {
    const [mode, setMode] = useState(null) // "folder" | "file"
    const [folderName, setFolderName] = useState("")
    const [createFolder] = useCreateFolderMutation()
    const [uploadFile] = useUploadFileMutation()

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0]
            if (file) {
                await uploadFile({ file, folderId })
                setMode(null)
            }
        },
    })

    const handleCreateFolder = async () => {
        if (!folderName.trim()) return
        await createFolder({ name: folderName, parent_id: folderId })
        setFolderName("")
        setMode(null)
    }

    return (
        <div className="mb-6">
            {!mode ? (
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
                        onClick={() => setMode("folder")}
                    >
                        <MdAddCircle/> New Folder
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
                        onClick={() => setMode("file")}
                    >
                        <MdUploadFile/> Upload File
                    </button>
                </div>
            ) : mode === "folder" ? (
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        placeholder="Folder name..."
                        className="border px-2 py-1 rounded"
                    />
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={handleCreateFolder}
                    >
                        Create
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                        onClick={() => setMode(null)}
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`p-6 border-2 border-dashed rounded cursor-pointer text-center ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
                        }`}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the file here...</p>
                    ) : (
                        <p>Drag & drop a file here, or click to select</p>
                    )}
                    <button
                        className="mt-2 px-3 py-1 bg-gray-400 text-white rounded"
                        onClick={(e) => {
                            e.stopPropagation()
                            setMode(null)
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    )
}

export default NewUploader
