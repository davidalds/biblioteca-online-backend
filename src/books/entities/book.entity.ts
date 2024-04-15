import { BookStatus } from 'src/types/bookStatus';

export class Book {
  title: string;
  author: string;
  publisher: string;
  publication_year: Date;
  ISBN: string;
  status: BookStatus;
}
