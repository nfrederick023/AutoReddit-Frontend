import { SubredditInfo } from './subredditList';

export class SelectedSubreddit {
  private selectedFlair: string;
  private postTitle: string;

  constructor(subreddit: SubredditInfo) {
    this.selectedFlair = subreddit.flairs[0]?.name || 'n/a';
    this.postTitle = '';
  }

  public setFlair(selectedFlair: string): void {
    this.selectedFlair = selectedFlair;
  }

  public getFlair(): string {
    return this.selectedFlair;
  }
}
