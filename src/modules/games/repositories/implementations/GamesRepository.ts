import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const title = this.repository
      .createQueryBuilder("games")
      .where("LOWER(games.title) LIKE LOWER(:title)", { title: `%${param}%` })
      .getMany();

    return title
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const allGames = this.repository.query(`
      SELECT COUNT(*)
        FROM games`
    );

    return allGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const usersByGameID = this.repository
      .createQueryBuilder("games")
      .relation(Game, "users")
      .of(id)
      .loadMany();

    return usersByGameID;
  }
}