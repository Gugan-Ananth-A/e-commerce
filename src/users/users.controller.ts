import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Patch('update')
    @UseGuards(AuthGuard)
    update(@Body() body: UpdateUserDto, @Req() req: Request){
        const payload = req['payload'];
        return this.userService.update(body, payload.sub);
    }

    @Patch('change-password')
    @UseGuards(AuthGuard)
    changePassword(@Body() body: ChangePasswordDto, @Req() req: Request){
        const payload = req['payload']
        return this.userService.changePassword(body, payload.sub);
    }

    @Get()
    @UseGuards(AuthGuard)
    getAllUsers(){
        return this.userService.getAllUsers();
    }
}
