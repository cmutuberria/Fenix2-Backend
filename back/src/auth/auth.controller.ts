import { Controller, UseGuards, Post, Request, Body, Get, Res, HttpStatus } from '@nestjs/common';
import { LoginDTO } from './login.dto';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly jwtService: JwtService) { }

    // @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Res() res, @Body() loginDTO: LoginDTO) {
        const userAuthenticated = await this.authService.validateLogin(loginDTO.username, loginDTO.password);
        if (userAuthenticated) {
            const token = this.authService.login(userAuthenticated);
            if (!userAuthenticated.activo) {
                return res.status(HttpStatus.OK).json({
                    token: "",
                    userAuthenticated: null,
                    success: false,
                    message: "Usuario Inactivo"
                })
            }
            return res.status(HttpStatus.OK).json({
                token: token.access_token,
                userAuthenticated,
                success: true,
                message: "Login ok"
            });
        } else {
            return res.status(HttpStatus.OK).json({
                token: "",
                userAuthenticated: null,
                success: false,
                message: "Credenciales incorrectas"
            })
        }
    }
    @Post('checkUserAuth')
    async checkUserAuth(@Res() res, @Body() { token }) {
        try {
            const { usuario, _id } = <any>this.jwtService.decode(token);
            const userAuthenticated = await this.authService.validateUser(usuario, _id);
            if (userAuthenticated&&userAuthenticated.activo) {
                const token = this.authService.login(userAuthenticated).access_token;
                return res.status(HttpStatus.OK).json({
                    success: true,
                    token,
                    userAuthenticated
                });
            } else {
                return res.status(HttpStatus.OK).json({
                    success: false,
                })
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                //success: false,
                error
            })

        }
    }

    @UseGuards(RolesGuard)
    @Get('me')
    @Roles('Administrador')
    getProfile(@Request() req) {
        const payload = <any>this.jwtService.decode(req.headers.authorization);
        return payload;
    }
}
