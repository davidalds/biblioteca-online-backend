import { Author } from 'src/authors/entities/author.entity';
import { Genre } from 'src/genres/entities/genre.entity';

export class CreateBookDto {
  title: string;
  author: Author;
  publisher: string;
  publication_year: Date;
  ISBN: string;
  genres: Genre[];
}
