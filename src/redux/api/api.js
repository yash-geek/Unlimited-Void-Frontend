import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config'

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/` }),
    tagTypes: [],
    endpoints: (builder) => ({
        // myChats: builder.query({
        //     query: () => ({
        //         url: "chat/my",
        //         credentials: 'include',
        //     }),
        //     providesTags: ['Chat'],
        // }),
        // sendFriendRequest: builder.mutation({
        //     query: (data) => ({
        //         url: 'user/sendrequest',
        //         method: "PUT",
        //         credentials: 'include',
        //         body: data,
        //     }),
        //     invalidatesTags: ['User']
        // }),

    })
})

export default api;
export const {
    usePrefetch,
    
} = api