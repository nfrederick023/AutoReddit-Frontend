import { AddSubredditPayload, DeleteSubredditPayload, Subreddit } from '../../utils/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subredditListAPI = createApi({
    reducerPath: 'subredditListAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/rest/' }),
    endpoints: (builder) => ({
        getSubredditList: builder.query<Subreddit[], void>({
            query: () => ({
                url: 'subredditListAPI',
                method: 'GET',
                refetchOnMountOrArgChange: true
            }),
        }),

        addSubreddit: builder.mutation({
            query: (body: AddSubredditPayload) => ({
                url: 'subredditListAPI',
                method: 'POST',
                body,
                headers: {
                    'content-type': 'application/json'
                },
            }),
        }),

        deleteSubreddit: builder.mutation({
            query: (body: DeleteSubredditPayload) => ({
                url: 'subredditListAPI',
                method: 'DELETE',
                body,
                headers: {
                    'content-type': 'application/json'
                },
            }),
        }),
    }),
});


export const { useGetSubredditListQuery, useAddSubredditMutation, useDeleteSubredditMutation } = subredditListAPI;