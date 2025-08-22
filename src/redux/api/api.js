import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/`,
        credentials: "include",
    }),
    tagTypes: ["Folder", "File", "Drive", "Trash"],
    endpoints: (builder) => ({
        getRootContents: builder.query({
            query: () => `folders/root`,
            providesTags: ["Folder", "File", "Drive"],
        }),
        getFolderContents: builder.query({
            query: (id = "root") => `folders/${id}`,
            providesTags: ["Folder", "File", "Drive"],
        }),
        getBreadcrumb: builder.query({
            query: (id) => `folders/${id}/breadcrumb`,
            providesTags: (result, error, id) => [{ type: "Folder", id }],
        }),

        // ✅ New endpoints
        createFolder: builder.mutation({
            query: ({ name, parent_id }) => ({
                url: `folders/`,
                method: "POST",
                body: { name, parent_id },
            }),
            invalidatesTags: ["Folder"],

        }),

        uploadFile: builder.mutation({
            query: ({ file, folderId }) => {
                const formData = new FormData()
                formData.append("file", file)
                if (folderId) formData.append("folderId", folderId)

                return {
                    url: `files/upload`,
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["File"],
        }),
        getTrash: builder.query({
            query: () => ({
                url: "folders/trash",
                credentials: "include",
            }),
            providesTags: ["Trash"],
        }),
        moveFileToTrash: builder.mutation({
            query: (id) => ({
                url: `/files/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Drive", "Trash"],
        }),

        moveFolderToTrash: builder.mutation({
            query: (id) => ({
                url: `/folders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Drive", "Trash"],
        }),
        restoreFile: builder.mutation({
            query: (id) => ({
                url: `files/restore/${id}`,
                method: "POST",
            }),
            invalidatesTags: ["Trash", "Files", "Folders", "Drive"],
        }),

        restoreFolder: builder.mutation({
            query: (id) => ({
                url: `/folders/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Trash", "Folders"],
        }),
        permanentDeleteFile: builder.mutation({
            query: (id) => ({
                url: `/files/permanent/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trash", "Files", "Trash"],
        }),

        permanentDeleteFolder: builder.mutation({
            query: (id) => ({
                url: `/folders/permanent/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Trash", "Folders", "Trash"],
        }),
        getSharedWithMe: builder.query({
            query: () => "/sharing/shared-with-me",
        }),
        inviteUserToFile: builder.mutation({
            query: ({ fileId, email, role }) => ({
                url: "sharing/invite",
                method: "POST",
                body: { fileId, email, role },
            }),
        }),
        getSignedUrl: builder.mutation({
            query: ({ fileId, expiresIn }) => ({
                url: "sharing/signed-url",
                method: "POST",
                body: { fileId, expiresIn }, // optional expiry
            }),
        }),
        searchFiles: builder.query({
            query: ({ q, owner = "me", page = 1, limit = 20 }) => {
                const params = new URLSearchParams({ q, owner, page, limit })
                return {
                    url: `/search/files?${params.toString()}`,

                }
            },
        }),

        searchFolders: builder.query({
            query: ({ q, owner = "me", page = 1, limit = 20 }) => {
                const params = new URLSearchParams({ q, owner, page, limit })
                return {
                    url: `/search/folders?${params.toString()}`,

                }
            },
        }),



    }),

})

export default api;
export const {
    useGetFolderContentsQuery,
    useGetRootContentsQuery,
    useGetFolderByPathQuery,
    useGetBreadcrumbQuery,
    useCreateFolderMutation,
    useUploadFileMutation,
    useGetTrashQuery,
    useMoveFileToTrashMutation,
    useMoveFolderToTrashMutation,
    useRestoreFileMutation,
    useRestoreFolderMutation,
    usePermanentDeleteFileMutation,
    usePermanentDeleteFolderMutation,
    useGetSharedWithMeQuery,
    useInviteUserToFileMutation,
    useGetSignedUrlMutation,
    useSearchFilesQuery,
    useSearchFoldersQuery

} = api

