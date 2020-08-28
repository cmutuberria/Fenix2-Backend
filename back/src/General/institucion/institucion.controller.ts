import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { InstitucionService } from './institucion.service';
import { InstitucionDTO } from './institucion.dto';

@Controller('institucion')
export class InstitucionController {
    constructor(private InstitucionService: InstitucionService) { };

    @Post('/')
    async create(@Res() res, @Body() InstitucionDTO: InstitucionDTO) {
        const obj = await this.InstitucionService.create(InstitucionDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Institución creada correctamente',
            obj
        })
    }
    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.InstitucionService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.InstitucionService.all()
        return res.status(HttpStatus.OK).json({all})
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.InstitucionService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Institución no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.InstitucionService.delete(id);
        if (!obj) {
            throw new NotFoundException('Institución no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Institución eliminadacorrectamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() InstitucionDTO: InstitucionDTO) {
        const obj = await this.InstitucionService.update(id, InstitucionDTO);
        if (!obj) {
            throw new NotFoundException('Institución no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Institución actualizada correctamente",
            obj
        })
    }
    
}
