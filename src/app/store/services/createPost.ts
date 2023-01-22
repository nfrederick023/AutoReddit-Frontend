import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const createPostAPI = createApi({
    reducerPath: 'createPostApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/rest/' }),
    endpoints: (builder) => ({
        createPost: builder.mutation({
            query: (body) => ({
                url: 'createPost',
                method: 'POST',
                body,
                headers: {
                    'content-type': 'application/json'
                },
            }),
        }),
    }),
});

export const { useCreatePostMutation } = createPostAPI;