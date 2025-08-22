import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFolderContentsQuery, useMoveFileToTrashMutation, useMoveFolderToTrashMutation, useGetBreadcrumbQuery } from "../redux/api/api";
import FileCard from "../components/specifics/FileCard";
import FolderCard from "../components/specifics/FolderCard";
import NewUploader from "../components/specifics/NewUploader";
import { toast } from "react-hot-toast";
import Loading from "../components/layouts/Loading";

const MyDrive = () => {
    const { "*": folderId } = useParams(); // catch dynamic id
    const navigate = useNavigate();

    const currentId = folderId || "root";

    const { data, isLoading, error } = useGetFolderContentsQuery(currentId);
    const { data: breadcrumb } = useGetBreadcrumbQuery(currentId, { skip: !currentId });

    const [moveFileToTrash] = useMoveFileToTrashMutation();
    const [moveFolderToTrash] = useMoveFolderToTrashMutation();

    const handleMoveToTrash = async (id, name, type) => {
        try {
            if (type === "file") {
                await moveFileToTrash(id).unwrap();
            } else {
                await moveFolderToTrash(id).unwrap();
            }
            toast.success(`${type} ${name} moved to trash`);
        } catch (err) {
            toast.error("Error moving to trash");
        }
    };

    const handleDownload = async (file) => {
        try {
            const response = await fetch(file.path);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download failed", err);
        }
    };
    console.log(data)

    if (isLoading) return <Loading />;
    if (error) return <p className="text-red-500">Failed to load folder</p>;

    return (
        <div className="p-4">
            {/* Breadcrumb */}
            <div className="flex gap-2 mb-4">
                <span
                    onClick={() => navigate("/my-drive")}
                    className="cursor-pointer text-blue-500"
                >
                    My Drive
                </span>
                {breadcrumb?.breadcrumb?.map((b, idx) => (
                    <span key={b.id} className="flex items-center gap-2">
                        <span>/</span>
                        <span
                            className="cursor-pointer text-blue-500"
                            onClick={() => navigate(`/my-drive/${b.id}`)}
                        >
                            {b.name}
                        </span>
                    </span>
                ))}
            </div>

            <NewUploader folderId={currentId !== "root" ? currentId : null} />

            {/* Folders */}
            <h2 className="font-semibold mb-2">Folders</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data?.folders?.length ? (
                    data.folders.map((f) => (
                        <FolderCard
                            key={f.id}
                            folder={f}
                            onDelete={() => handleMoveToTrash(f.id, f.name, "folder")}
                            actions={["trash"]}
                            onOpen={() => navigate(`/my-drive/${f.id}`)} // ✅ now by id not path
                        />
                    ))
                ) : (
                    <p>No folders</p>
                )}
            </div>

            {/* Files */}
            <h2 className="font-semibold mt-6 mb-2">Files</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data?.files?.map((file) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        onDelete={() => handleMoveToTrash(file.id, file.name, "file")}
                        onDownload={() => handleDownload(file)}
                        actions={["trash", "download", "share", "publicLink"]}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyDrive;
