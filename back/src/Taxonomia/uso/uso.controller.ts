import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { UsoService } from './uso.service';
import { UsoDTO } from './uso.dto';

@Controller('uso')
export class UsoController {
    constructor(private usoService: UsoService) { };

    @Post('/')
    async create(@Res() res, @Body() usoDTO: UsoDTO) {
        const obj = await this.usoService.create(usoDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Uso creado correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort } = queryParams;
        const all = await this.usoService.getAll(parseInt(row), parseInt(page), filtro, sort);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all')
    async All(@Res() res) { 
        const all = await this.usoService.all()
        return res.status(HttpStatus.OK).json({all})
    }

    @Get('/NotAssigned/:id')
    async getNotAssigned(@Res() res, @Param('id') idEspecie: string) {
        const all = await this.usoService.getNotAssigned(idEspecie);
        return res.status(HttpStatus.OK).json({all})
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
        const obj = await this.usoService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Uso no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.usoService.delete(id);
        if (!obj) {
            throw new NotFoundException('Uso no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Uso eliminado correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() usoDTO: UsoDTO) {
        const obj = await this.usoService.update(id, usoDTO);
        if (!obj) {
            throw new NotFoundException('Uso no encontrado');
        }
        return res.status(HttpStatus.OK).json({
            message: "Uso actualizado correctamente",
            obj
        })
    }

}
