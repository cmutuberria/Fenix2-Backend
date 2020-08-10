import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { TipoEstructuraService } from './tipo-estructura.service';
import { TipoEstructuraDTO } from './tipo-estructura.dto';

@Controller('tipoEstructura')
export class TipoEstructuraController {
    constructor(private tipoEstructuraService: TipoEstructuraService) { };

    @Post('/')
    async create(@Res() res, @Body() tipoEstructuraDTO: TipoEstructuraDTO) {
        const obj = await this.tipoEstructuraService.create(tipoEstructuraDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Estructura creada correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort, tipo } = queryParams;
        const all = await this.tipoEstructuraService.getAll(parseInt(row), parseInt(page), filtro, sort, tipo);
        return res.status(HttpStatus.OK).json(all)
    }
    
    @Get('/All')
    async All(@Res() res) {        
        const all = await this.tipoEstructuraService.all();
        return res.status(HttpStatus.OK).json(all)
    }
    
    @Get('/Childrens/:id')
    async getChildrens(@Res() res, @Param('id') id: string) {
         const obj = await this.tipoEstructuraService.getChildrens(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/AllChildrens/:id')
    async getAllChildrens(@Res() res, @Param('id') id: string) {
         const obj = await this.tipoEstructuraService.getAllChildrens(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/especie')
    async getEspecie(@Res() res) {
         const obj = await this.tipoEstructuraService.getEspecie();
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
         const obj = await this.tipoEstructuraService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.tipoEstructuraService.delete(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Estructura eliminada correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() tipoEstructuraDTO: TipoEstructuraDTO) {
        const obj = await this.tipoEstructuraService.update(id, tipoEstructuraDTO);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Estructura actualizada correctamente",
            obj
        })
    }

}
