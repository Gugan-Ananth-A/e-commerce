import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { RefreshToken } from 'src/auth/entity/refresh_token.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(RefreshToken) private readonly refreshRepository: Repository<RefreshToken>
    ){}

    async update(updateUserDto: UpdateUserDto, id: string){
        const result = await this.userRepository.update(+id, updateUserDto);
        if(result.affected === 0) throw new NotFoundException('User not found');
        const user = await this.userRepository.findOneBy({ id: +id });
        return {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            role: user?.role,
            email: user?.email
        }
    }

    async getAllUsers(){
        const users = await this.userRepository.find();
        return users.map((user) => {
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role, 
                email: user.email
            }
        });
    }

    async changePassword(changePasswordDto: ChangePasswordDto, id: string){
        const user = await this.userRepository.findOne({where: {id: +id}});
        if(!user) throw new NotFoundException('User not found');
        const isMatch = await bcrypt.compare(changePasswordDto.oldPassword, user.hash);
        if(!isMatch) throw new UnauthorizedException('Invalid credentials');
        user.hash = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await this.refreshRepository.delete({user: { id: +id }});
        await this.userRepository.save(user);
        return { message: 'Password changed successfully' };
    }
}
