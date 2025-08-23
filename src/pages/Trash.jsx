import React from "react"
import {
  useGetTrashQuery,
  usePermanentDeleteFileMutation,
  usePermanentDeleteFolderMutation,
  useRestoreFileMutation,
  useRestoreFolderMutation
} from "../redux/api/api"
import FileCard from "../components/specifics/FileCard"
import FolderCard from "../components/specifics/FolderCard"
import toast from "react-hot-toast"
import Loading from "../components/layouts/Loading"

const Trash = () => {
  const { data, isLoading, error } = useGetTrashQuery()
  const [restoreFile] = useRestoreFileMutation()
  const [restoreFolder] = useRestoreFolderMutation()

  const handleRestore = async (id, name, type) => {
    try {
      if (type === "file") {
        await restoreFile(id).unwrap()
        toast.success(`File ${name} restored`)

      } else {
        await restoreFolder(id).unwrap()
        toast.success(`Folder ${name} restored`)
      }
    } catch (err) {
      toast.error("Restore failed:", err)
    }
  }

  const [deleteFilePermanent] = usePermanentDeleteFileMutation()
  const [deleteFolderPermanent] = usePermanentDeleteFolderMutation()

  const handleDelete = async (id, name, type) => {
    try {
      if (type === "file") {
        await deleteFilePermanent(id).unwrap()
        toast.success(`File ${name} permanently deleted`)
      } else {
        await deleteFolderPermanent(id).unwrap()
        toast.success(`Folder ${name} permanently deleted`)
      }
    } catch (err) {
      toast.error("Permanent delete failed")
    }
  }

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
  if (error) return <p className="text-red-500">Failed to load trash</p>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trash</h1>

      {/* Folders */}
      <h2 className="font-semibold mb-2">Deleted Folders</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.folders?.length
          ? data.folders.map(f => (
            <FolderCard
              key={f.id}
              folder={f}
              onDelete={() => handleDelete(f.id, f.name, "folder")}
              onRestore={() => handleRestore(f.id, f.name, "folder")}
              actions={["restore", "delete"]}
            />
          ))
          : <p>No deleted folders</p>}
      </div>

      {/* Files */}
      <h2 className="font-semibold mt-6 mb-2">Deleted Files</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.files?.length
          ? data.files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={() => handleDelete(file.id, file.name, "file")}
              onRestore={() => handleRestore(file.id, file.name, "file")}
              onDownload={() => handleDownload(file)}
              actions={["restore", "delete", "download"]}
            />
          ))
          : <p>No deleted files</p>}
      </div>
    </div>
  )
}

export default Trash
