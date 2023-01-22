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
    readonly toastType: ToastTypes
    readonly message: string
}

/**
 * API
 */
export interface AddSubredditPayload {
    readonly subredditName: string;
    readonly categoryName: string;
}

export interface DeleteSubredditPayload {
    readonly subredditNames: string[];
}

/**
 * Global 
 */

export interface Flair {
    readonly name: string;
    readonly isTextEditable: boolean;
    readonly id: string;
}

export interface SubredditAbout {
    readonly url: string;
    readonly allowsVideoGifs: boolean;
    readonly allowsVideos: boolean;
    readonly isCrosspostable: boolean;
    readonly isNSFW: boolean;
}

export interface SubredditInfo extends SubredditAbout {
    readonly flairs: Flair[];
}

export interface Subreddit {
    readonly name: string;
    readonly info: SubredditInfo;
    readonly categories: string[];
    readonly notes: string[];
}
