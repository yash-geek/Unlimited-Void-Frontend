import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  useMoveFileToTrashMutation,
  useMoveFolderToTrashMutation,
  useSearchFilesQuery,
  useSearchFoldersQuery,
} from "../redux/api/api"
import FileCard from "../components/specifics/FileCard"
import FolderCard from "../components/specifics/FolderCard"
import Loading from "../components/layouts/Loading"

const Home = () => {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const navigate = useNavigate()
  const [moveFileToTrash] = useMoveFileToTrashMutation()
  const [moveFolderToTrash] = useMoveFolderToTrashMutation()

  const handleMoveToTrash = async (id, name, type) => {
    try {
      if (type === "file") {
        await moveFileToTrash(id).unwrap()
      } else {
        await moveFolderToTrash(id).unwrap()
      }
      toast.success(`${type} ${name} moved to trash`)
    } catch (err) {
      toast.error("Error moving to trash")
    }
  }

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.path)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed", err)
    }
  }

  // debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handler)
  }, [query])

  // API calls
  const {
    data: folderData,
    isFetching: foldersLoading,
    error: folderError,
  } = useSearchFoldersQuery(
    { q: debouncedQuery, owner: "me" },
    { skip: !debouncedQuery }
  )

  const {
    data: fileData,
    isFetching: filesLoading,
    error: fileError,
  } = useSearchFilesQuery(
    { q: debouncedQuery, owner: "me" },
    { skip: !debouncedQuery }
  )

  useEffect(() => {
    if (folderError || fileError) toast.error("Search failed")
  }, [folderError, fileError])

  const folders = folderData?.results || []
  const files = fileData?.results || []

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🔎 Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search files & folders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Results */}
      {(foldersLoading || filesLoading) && <Loading />}

      <div>
        <h2 className="text-lg font-semibold mb-3">Search Results</h2>

        {!debouncedQuery && <p className="text-gray-500">Type to search...</p>}

        {folders.length === 0 &&
          files.length === 0 &&
          !foldersLoading &&
          !filesLoading &&
          debouncedQuery && (
            <p className="text-gray-500">No results found</p>
          )}

        {/* Folders */}
        {folders.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">📂 Folders</h3>
            <div className="flex flex-wrap gap-4">
              {folders.map((folder) => (
                <div key={folder.id} className="w-40">
                  <FolderCard
                    folder={folder}
                    onOpen={() => navigate(`/my-drive/${folder.id}`)}
                    onDelete={() =>
                      handleMoveToTrash(folder.id, folder.name, "folder")
                    }
                    actions={["trash"]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {files.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-2">📄 Files</h3>
            <div className="flex flex-wrap gap-4">
              {files.map((file) => (
                <div key={file.id} className="w-40">
                  <FileCard
                    file={file}
                    onDelete={() =>
                      handleMoveToTrash(file.id, file.name, "file")
                    }
                    onDownload={() => handleDownload(file)}
                    actions={["trash", "download", "share", "publicLink"]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
