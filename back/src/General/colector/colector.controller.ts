import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { ColectorService } from './colector.service';
import { ColectorDTO } from './colector.dto';

@Controller('colector')
export class ColectorController {
    constructor(private colectorService: ColectorService) { };

    @Post('/')
    async create(@Res() res, @Body() colectorDTO: ColectorDTO) {
        const obj = await this.colectorService.create(colectorDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Colector creado correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.colectorService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.colectorService.all()
        return res.status(HttpStatus.OK).json({all})
    }

    @Get('/Cuba')
    async getCuba(@Res() res) {
        const obj = await this.colectorService.getCuba();
        if (!obj) {
            throw new NotFoundException('Colector no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.colectorService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Colector no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.colectorService.delete(id);
        if (!obj) {
            throw new NotFoundException('Colector no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Colector eliminado correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() colectorDTO: ColectorDTO) {
        const obj = await this.colectorService.update(id, colectorDTO);
        if (!obj) {
            throw new NotFoundException('Colector no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Colector actualizado correctamente",
            obj
        })
    }

}
