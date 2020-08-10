import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { JardinService } from './jardin.service';
import { JardinDTO } from './jardin.dto';

@Controller('jardin')
export class JardinController {
    constructor(private JardinService: JardinService) { };

    @Post('/')
    async create(@Res() res, @Body() JardinDTO: JardinDTO) {
        const obj = await this.JardinService.create(JardinDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Jardín creado correctamente',
            obj
        })
    }
    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.JardinService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.JardinService.all()
        return res.status(HttpStatus.OK).json({all})
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.JardinService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Jardín no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.JardinService.delete(id);
        if (!obj) {
            throw new NotFoundException('Jardín no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Jardín eliminado correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() JardinDTO: JardinDTO) {
        const obj = await this.JardinService.update(id, JardinDTO);
        if (!obj) {
            throw new NotFoundException('Jardín no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Jardín actualizado correctamente",
            obj
        })
    }
    
}
