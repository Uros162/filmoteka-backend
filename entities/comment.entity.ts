import { type } from "os";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Administrator } from "./administrator.entity";
import { Movie } from "./movie.entity";
import { User } from "./user.entity";

@Index("uq_comment_user_id_movie_id", ["userId", "movieId"], { unique: true })
@Index(
  "fk_comment_moderator_administrator_id",
  ["moderatorAdministratorId"],
  {}
)
@Index("fk_comment_user_id", ["userId"], {})
@Index("fk_comment_movie_id", ["movieId"], {})
@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn({ type: "int", name: "comment_id", unsigned: true })
  commentId: number;

  @Column({
    type:"int", 
    name: "user_id", 
    unsigned: true
  })
  userId: number;

  @Column({
    type:"int", 
    name: "movie_id", 
    unsigned: true 
  })
  movieId: number;

  @Column({
    type:"mediumtext", 
    name: "original_value" 
  })
  originalValue: string;

  @Column({
    type: "mediumtext", 
    name: "moderated_value",
    nullable: true,
  })
  moderatedValue: string | null;

  @Column({
    type:"tinyint", 
    name: "rating_value", 
    width: 1 
  })
  ratingValue: boolean;

  @Column({
    type: "enum", 
    enum: ["pending", "approved", "denied"],
    default: () => "'pending'",
  })
  status: "pending" | "approved" | "denied";

  @Column({
    type: "int", 
    name: "moderator_administrator_id",
    nullable: true,
    unsigned: true,
  })
  moderatorAdministratorId: number | null;

  @Column({
    type: "timestamp", 
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  // ova je dodata zasebno
  // @ManyToMany(type => Movie, movie => movie.moviePrices)
  // @JoinTable({
  //   name: "movie",
  //   joinColumn: { name: "movie_id", referencedColumnName: "movieId"},
  //   inverseJoinColumn: { name: "user_id", referencedColumnName: "userId"}
  // })
  // movies: Movie[];

  @ManyToOne(() => Administrator, (administrator) => administrator.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    {
      name: "moderator_administrator_id",
      referencedColumnName: "administratorId",
    },
  ])
  moderatorAdministrator: Administrator;

  @ManyToOne(() => Movie, (movie) => movie.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "movie_id", referencedColumnName: "movieId" }])
  movie: Movie;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}