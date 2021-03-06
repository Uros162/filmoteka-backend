import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { UserRegistrationDto } from "src/dtos/user/user.registration.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import * as crypto from 'crypto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
    constructor(@InjectRepository(User) private readonly user: Repository<User>,) {
        super(user); 
    }

    async register(data: UserRegistrationDto): Promise<User | ApiResponse> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();
    
        const newUser: User = new User();
        newUser.email        = data.email;
        newUser.passwordHash = passwordHashString;
        newUser.username     = data.username;
        newUser.forename     = data.forename;
        newUser.surname      = data.surname;

        try {
            const saveduser = await this.user.save(newUser);

            if (!saveduser) {
                throw new Error('');
            }

            return saveduser;
        } catch (e) {
            return new ApiResponse('error', -6001, 'This user account cannot be created.');
        }
    }

    async getById(id) {
        return await this.user.findOne(id);
    }

    async getByUsernamme(username: string): Promise<User | undefined> {
        const user = await this.user.findOne({
            username: username
        });
        if (user) {
            return user;
        }
        return undefined;
    }
}