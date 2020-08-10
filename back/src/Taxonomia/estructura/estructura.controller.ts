import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';
import { EstructuraService } from './estructura.service';
import { EstructuraDTO } from './estructura.dto';

@Controller('estructura')
export class EstructuraController {
    constructor(private estructuraService: EstructuraService) { };

    @Post('/')
    async create(@Res() res, @Body() estructuraDTO: EstructuraDTO) {
        const obj = await this.estructuraService.create(estructuraDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Estructura creada correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort, tipo } = queryParams;
        const all = await this.estructuraService.getAll(parseInt(row), parseInt(page), filtro, sort, tipo);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/AllTipo')
    async AllTipo(@Res() res, @Query() queryParams) {
        const { tipo } = queryParams;
        const all = await this.estructuraService.allTipo(tipo);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/All')
    async All(@Res() res) {        
        const all = await this.estructuraService.all();
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/Root')
    async Root(@Res() res) {        
        const all = await this.estructuraService.root();
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/ParentCandidates')
    async ParentCandidates(@Res() res, @Query() queryParams) {
        const { tipo } = queryParams;
        const all = await this.estructuraService.parentCandidates(tipo);
        return res.status(HttpStatus.OK).json(all)
    }
    

    @Get('/Childrens/:id')
    async getChildrens(@Res() res, @Param('id') id: string) {
        const obj = await this.estructuraService.getChildrens(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/Parents/:id')
    async getParents(@Res() res, @Param('id') id: string) {
        const obj = await this.estructuraService.getParents(id);
        // const obj = await this.estructuraService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }
    @Get('/OneWithParentsAndChildrens/:id')
    async getOneWithParentsAndChildrens(@Res() res, @Param('id') id: string) {
        const obj = {
                 obj:await this.estructuraService.getOne(id),
                 parents: await this.estructuraService.getParents(id),
                 childrens:await this.estructuraService.getChildrens(id)
            }
        if (!obj.obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json(obj)
    }
    @Get('/:id')
    async getOne(@Res() res, @Param('id') id: string) {
         const obj = await this.estructuraService.getOne(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            obj
        })
    }

    @Delete('/:id')
    async delete(@Res() res, @Param('id') id: string) {
        const obj = await this.estructuraService.delete(id);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }        
        return res.status(HttpStatus.OK).json({
            message: "Estructura eliminada correctamente",
            obj
        })
    }

    @Put('/:id')
    async update(@Res() res, @Param('id') id: string, @Body() estructuraDTO: EstructuraDTO) {
        const obj = await this.estructuraService.update(id, estructuraDTO);
        if (!obj) {
            throw new NotFoundException('Estructura no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Estructura actualizada correctamente",
            obj
        })
    }

}
