/**
 * Redux 
 */
export interface LoaderState {
    isLoading: boolean,
}

export enum ToastTypes {
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error'
}

export interface ToastState {
    open: boolean,
    toastType: ToastTypes
    message: string
}

/**
 * API
 */
export interface AddSubredditPayload {
    subredditName: string;
    categoryName: string;
}

export interface DeleteSubredditPayload {
    subredditNames: string[];
}

/**
 * Global 
 */

export interface SubredditFlair {
    name: string;
    isTextEditable: boolean;
    id: string;
}

export interface SubredditAbout {
    url: string;
    allowsVideoGifs: boolean;
    allowsVideos: boolean;
    isCrosspostable: boolean;
    isNSFW: boolean;
}

export interface SubredditInfo extends SubredditAbout {
    flairs: SubredditFlair[];
}

export interface Subreddit {
    name: string;
    info: SubredditInfo;
    categories: string[];
    notes: string[];
}