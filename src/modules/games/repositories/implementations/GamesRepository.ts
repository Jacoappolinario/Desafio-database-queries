import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const title = await this.repository
      .createQueryBuilder('games')
      .select('games.title')
      .where('games.title ilike :title', { title: `%${param}%` })
      .getMany()

      return title
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games'); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
   const games = await this.repository
      .createQueryBuilder('games')
      .innerJoinAndSelect('games.users', 'user')
      .where("games.id = :id", { id: id })
      .getOneOrFail()
      
    return games.users
  }
}
