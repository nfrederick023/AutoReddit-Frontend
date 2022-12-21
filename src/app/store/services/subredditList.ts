import { SubredditCategory, SubredditDetails} from '../../common/interfaces/subredditListTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const subredditListAPI = createApi({
  reducerPath: 'subredditListAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/rest/' }),
  endpoints: (builder) => ({
   getSubredditList: builder.query<SubredditCategory[], void>({
      
      query: () => ({
        url: 'subredditListAPI',
        method: 'GET',
         refetchOnMountOrArgChange: true
      }),
    }),

    addSubreddit: builder.mutation({
      query: (body: SubredditDetails) => ({
        url: 'subredditListAPI',
        method: 'POST',
        body,
        headers: {
         'content-type': 'application/json'
       },
      }),
    }),

    deleteSubreddit: builder.mutation({
      query: (body: SubredditDetails[]) => ({
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