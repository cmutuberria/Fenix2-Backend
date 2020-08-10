import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { EspecieService } from './especie.service';
import { EspecieDTO } from './especie.dto';

@Controller('especie')
export class EspecieController {
    constructor(private EspecieService: EspecieService) { };

    @Post('/')
    async create(@Res() res, @Body() EspecieDTO: EspecieDTO) {
        const obj = await this.EspecieService.create(EspecieDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Especie creada correctamente',
            obj
        })
    }
    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.EspecieService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.EspecieService.all()
        return res.status(HttpStatus.OK).json({all})
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.EspecieService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Especie no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.EspecieService.delete(id);
        if (!obj) {
            throw new NotFoundException('Especie no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Especie eliminada correctamente",
            obj
        })
    }

    @Put('/edit/:id')
    async edit(@Res() res, @Param('id') id: string, @Body() EspecieDTO: EspecieDTO) {
        const obj = await this.EspecieService.edit(id, EspecieDTO);
        if (!obj) {
            throw new NotFoundException('Especie no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Especie actualizada correctamente",
            obj
        })
    }
    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() EspecieDTO: EspecieDTO) {
        const obj = await this.EspecieService.update(id, EspecieDTO);
        if (!obj) {
            throw new NotFoundException('Especie no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Especie actualizada correctamente",
            obj
        })
    }
    
}
