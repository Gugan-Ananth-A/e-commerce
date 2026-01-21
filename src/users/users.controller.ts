import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Patch('update/:id')
    @UseGuards(AuthGuard)
    update(@Body() body: UpdateUserDto, @Param('id') id: string){
        return this.userService.update(body, id);
    }

    @Patch('change-password/:id')
    @UseGuards(AuthGuard)
    changePassword(@Body() body: ChangePasswordDto, @Param('id') id: string){
        return this.userService.changePassword(body, id);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllUsers(){
        return this.userService.getAllUsers();
    }
}
