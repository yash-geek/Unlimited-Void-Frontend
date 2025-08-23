import React from "react"
import { useGetSharedWithMeQuery } from "../redux/api/api"
import FileCard from "../components/specifics/FileCard"
import Loading from "../components/layouts/Loading"
import toast from "react-hot-toast"

const Shared = () => {
  const { data, isLoading, error } = useGetSharedWithMeQuery()
  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.path) // should be a signed or public URL
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
      toast.success("Download Started")
    } catch (err) {
      toast.error("Download failed", err)
    }
  }
  if (isLoading) return <Loading />
  if (error) return <p className="text-red-500">Failed to load shared items</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Shared with me</h1>

      {/* Files */}
      <h2 className="font-semibold mb-2">Files</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.files?.length ? (
          data.files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              actions={["download"]} 
              onDownload={() => handleDownload(file)}
              // only allow viewing/downloading
            />
          ))
        ) : (
          <p>No files shared with you</p>
        )}
      </div>

      {/* Folders (future) */}
      <h2 className="font-semibold mt-6 mb-2">Folders</h2>
      <p>Folder sharing not implemented yet</p>
    </div>
  )
}

export default Shared
