import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorDTO } from './trabajador.dto';
import  {roles}  from "./roles.enum";
// import * as bcrypt from "bcryptjs";

@Controller('trabajador')
export class TrabajadorController {
    constructor(private TrabajadorService: TrabajadorService) { };
    /*@Get('/sha')
    async sha(@Res() res, @Query() queryParams) {
        const { pass } = queryParams;
        
        return res.status(HttpStatus.OK).json({pass:await bcrypt.hash(pass, 10)})
    }*/
    @Get('/unique')
    async isUnique(@Res() res, @Query() queryParams) {
        const { field, value, _id } = queryParams;
        const resp = await this.TrabajadorService.isUnique(field, value, _id);
        return res.status(HttpStatus.OK).json({
            unique:resp==0,
            field,
            value,
            _id
        })
    }
    @Get('/login/:username')
    async findOne(@Res() res, @Param('username') username: string) {
        const obj = await this.TrabajadorService.findOne(username);
        if (!obj) {
            throw new NotFoundException('Trabajador no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Get('/roles')
    async getRoles(@Res() res) {
        return res.status(HttpStatus.OK).json(Object.values(roles))
    }


    @Post('/')
    async create(@Res() res, @Body() TrabajadorDTO: TrabajadorDTO) {
        const obj = await this.TrabajadorService.create(TrabajadorDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Trabajador creado correctamente',
            obj
        })
    }
    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { institucion, row, page, filtro, sort } = queryParams;
        const all = await this.TrabajadorService.getAll(institucion, parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.TrabajadorService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Trabajador no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.TrabajadorService.delete(id);
        if (!obj) {
            throw new NotFoundException('Trabajador no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Trabajador eliminado correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() TrabajadorDTO: TrabajadorDTO) {
        const obj = await this.TrabajadorService.update(id, TrabajadorDTO);
        if (!obj) {
            throw new NotFoundException('Trabajador no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Trabajador actualizado correctamente",
            obj
        })
    }
    @Put('/changePassword/:id')
    async changePassword(@Res() res, @Param('id') id: string, @Body("password") password: string) {
        const obj = await this.TrabajadorService.changePassword(id, password);
        if (!obj) {
            throw new NotFoundException('Trabajador  no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Trabajador actualizado correctamente",
            obj
        })
    }
    
}
