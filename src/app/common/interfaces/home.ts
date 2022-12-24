import { SubredditInfo } from './subredditList';

export enum Tags {
  OC = 'OC',
  SPOILER = 'SPOILER',
  NSFW = 'NSFW'
}

export class SelectedSubreddit {
  private info: SubredditInfo;
  private flair: string;
  private title: string;
  private tags: Tags[];

  constructor(subreddit: SubredditInfo) {
    this.info = subreddit;
    this.flair = subreddit.flairs[0]?.name || 'n/a';
    this.title = '';
    this.tags = [];
  }

  public getInfo(): SubredditInfo {
    return this.info;
  }

  public setInfo = (info: SubredditInfo): SelectedSubreddit => {
    this.info = info;
    return this;
  };

  public setFlair(flair: string): SelectedSubreddit {
    this.flair = flair;
    return this;
  }

  public getFlair(): string {
    return this.flair;
  }

  public setTitle(title: string): SelectedSubreddit {
    this.title = title;
    return this;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTages(tags: Tags[]): SelectedSubreddit {
    this.tags = tags;
    return this;
  }

  public getTags(): Tags[] {
    return this.tags;
  }
}
