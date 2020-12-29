import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { AmenazaService } from './amenaza.service';
import { AmenazaDTO } from './amenaza.dto';


@Controller('amenaza')
export class AmenazaController {
    constructor(private amenazaService: AmenazaService) { };

    @Post('/')
    async create(@Res() res, @Body() amenazaDTO: AmenazaDTO) {
        const obj = await this.amenazaService.create(amenazaDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Amenaza creada correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.amenazaService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.amenazaService.all()
        return res.status(HttpStatus.OK).json({all})
    }

    @Get('/all-amenazas')
    async getAmenazas(@Res() res) {
        const all = await this.amenazaService.getAmenazas(1);
        return res.status(HttpStatus.OK).json({
            all
        })
    }
    @Get('/all-estreses')
    async getEstreses(@Res() res) {
        const all = await this.amenazaService.getAmenazas(0);
        return res.status(HttpStatus.OK).json({
            all
        })
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.amenazaService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Amenaza no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.amenazaService.delete(id);
        if (!obj) {
            throw new NotFoundException('Amenaza no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Amenaza eliminada correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() amenazaDTO: AmenazaDTO) {
        const obj = await this.amenazaService.update(id, amenazaDTO);
        if (!obj) {
            throw new NotFoundException('Amenaza no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Amenaza actualizada correctamente",
            obj
        })
    }

}
