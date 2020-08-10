import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisDTO } from './pais.dto';

@Controller('pais')
export class PaisController {
    constructor(private paisService: PaisService) { };

    @Post('/')
    async create(@Res() res, @Body() paisDTO: PaisDTO) {
        const obj = await this.paisService.create(paisDTO);
        return res.status(HttpStatus.OK).json({
            message: 'País creado correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.paisService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.paisService.all()
        return res.status(HttpStatus.OK).json({all})
    }

    @Get('/Cuba')
    async getCuba(@Res() res) {
        const obj = await this.paisService.getCuba();
        if (!obj) {
            throw new NotFoundException('País no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.paisService.getOne(id);
        if (!obj) {
            throw new NotFoundException('País no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.paisService.delete(id);
        if (!obj) {
            throw new NotFoundException('País no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "País eliminado correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() paisDTO: PaisDTO) {
        const obj = await this.paisService.update(id, paisDTO);
        if (!obj) {
            throw new NotFoundException('País no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "País actualizado correctamente",
            obj
        })
    }

}
