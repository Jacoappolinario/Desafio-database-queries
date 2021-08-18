import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOneOrFail({ 
      relations: ["games"],
      where: { id: user_id } 
    })

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const users =  this.repository.query('select * from users order by first_name asc');
    
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user = await this.repository.query(`
    select first_name, last_name, email 
    from users 
    where lower(first_name) = lower($1) and lower(last_name) = lower($2)`, 
    [first_name, last_name]);
    
    return user
  }
}
