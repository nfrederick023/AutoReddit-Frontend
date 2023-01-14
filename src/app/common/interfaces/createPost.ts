import { Tags } from './home';
import dayjs, { Dayjs } from 'dayjs';

export interface PostDetails {
  title: string,
  flairs: string,
  tags: Tags[],
}

export class CreatePost {
  public comment: string;
  public imageLink: string;
  public date: Dayjs;
  public defaultTags: Tags[];
  public defaultTitle: string;

  constructor() {
    this.comment = '';
    this.imageLink = '';
    this.defaultTags = [];
    this.date = dayjs().add(30, 'minutes');
    this.defaultTitle = '';
  }
}