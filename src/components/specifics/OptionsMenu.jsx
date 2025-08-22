import React, { useState } from "react"
import { FiMoreVertical } from "react-icons/fi"
import ShareButton from "./ShareButton"
import { useGetSignedUrlMutation } from "../../redux/api/api"
import { toast } from "react-hot-toast"

const OptionsMenu = ({ onDelete, onRestore, onDownload, isFile, fileId, actions = [] }) => {
  const [open, setOpen] = useState(false)
  const [getSignedUrl] = useGetSignedUrlMutation()

  const handlePublicLink = async () => {
    try {
      const res = await getSignedUrl({ fileId }).unwrap()
      navigator.clipboard.writeText(res.url)
      toast.success("Public link copied to clipboard!")
      setOpen(false)
    } catch (err) {
      toast.error("Failed to generate public link")
      console.error(err)
    }
  }

  return (
    <div className="absolute top-2 right-2">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        <FiMoreVertical />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10"
        >
          <ul className="flex flex-col text-sm">
            {actions.includes("trash") && (
              <li
                onClick={() => { onDelete?.(); setOpen(false) }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Move to Trash
              </li>
            )}

            {actions.includes("delete") && (
              <li
                onClick={() => { onDelete?.(); setOpen(false) }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
              >
                Delete Permanently
              </li>
            )}

            {actions.includes("restore") && (
              <li
                onClick={() => { onRestore?.(); setOpen(false) }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Restore
              </li>
            )}

            {isFile && actions.includes("download") && (
              <li
                onClick={() => { onDownload?.(); setOpen(false) }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Download
              </li>
            )}

            {/* 🌟 Public Link Option */}
            {isFile && actions.includes("publicLink") && (
              <li
                onClick={handlePublicLink}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Get Public Link
              </li>
            )}
            
            {isFile && actions.includes("share") && (
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <ShareButton fileId={fileId} onCloseMenu={() => setOpen(false)} />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default OptionsMenu
