export interface SubredditDetails {
   subredditName: string;
   categoryName: string;
}

export interface Flair {
   name: string;
   isTextEditable: boolean;
   id: string;
}

export interface SubredditAbout {
   name: string;
   url: string;
   allowsVideoGifs: boolean;
   allowsVideos: boolean;
   isCrosspostable: boolean;
   isNSFW: boolean;
}

export interface SubredditCategory {
   categoryName: string;
   subreddits: SubredditInfo[];
}

export interface SubredditInfo extends SubredditAbout {
   flairs: Flair[];
   notes: string[];
}

