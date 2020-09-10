import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query, UseInterceptors, UploadedFiles
} from '@nestjs/common';
import {AnyFilesInterceptor} from '@nestjs/platform-express';
import { EstructuraService } from './estructura.service';
import { EstructuraDTO } from './estructura.dto';
import { EspecieDTO } from './especie.dto';
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from 'fs';

const storageOptions = diskStorage({
    destination: "./uploads/taxonomia",
    filename: (req, file, callback) => {
      callback(null, generateFilename(file));
    }
  });
  
  // You may want to move this function into a separate file then import it to make it cleaner
  function generateFilename(file) {
    return `${Date.now()}${extname(file.originalname)}`;
  }
  
@Controller('estructura')
export class EstructuraController {
    constructor(private estructuraService: EstructuraService) { };

    @Post('upload')
    @UseInterceptors(AnyFilesInterceptor({
        storage: storageOptions
      }))
    uploadFile(@Res() res,@Body() estructuraDTO: any, @UploadedFiles() files) {
        estructuraDTO.img_individuo=files[0]?files[0].path:"" 
        estructuraDTO.img_herbario=files[1]?files[1].path:"" 
        console.log("estructuraDTO",estructuraDTO)
        console.log("files",files);

        return res.status(HttpStatus.OK).json({
            message: 'Estructura creada correctamente',
        })
    }

    @Post('img-individuo')
    @UseInterceptors(AnyFilesInterceptor({
        storage: storageOptions
      }))
   async imgIndividuo(@Res() res,@Body() data: any, @UploadedFiles() files) { 
           
       const especieDTO = new EspecieDTO()
       especieDTO.img_individuo=files[0]?files[0].path:""
       const oldObj = await this.estructuraService.getOne(data._id);
       if (oldObj&&oldObj.img_individuo!=null) {
           fs.unlink(oldObj.img_individuo,(err) => {
            if (err) {
              console.error(err)
            }
        });
       }
       const obj = await this.estructuraService.update(data._id, especieDTO);

        return res.status(HttpStatus.OK).json({
            message: `${oldObj.tipo.nombre} creada correctamente`,
        })
    }


    @Post('/')
    async create(@Res() res, @Body() estructuraDTO: EstructuraDTO) {
        const obj = await this.estructuraService.create(estructuraDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Estructura creada correctamente',
            obj
        })
    }
    @Post('/especie')
    async createEspe(@Res() res, @Body() especieDTO: EspecieDTO) {
        const obj = await this.estructuraService.create(especieDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Especie creada correctamente',
            obj
        })
    }

    @Get('/')
    async getAll(@Res() res, @Query() queryParams) {
        const { row, page, filtro, sort, tipo } = queryParams;
        const all = await this.estructuraService.getAll(parseInt(row), parseInt(page), filtro, sort, tipo);
        return res.status(HttpStatus.OK).json(all)
    }
    @Get('/all-especies')
    async getAllEspecies(@Res() res, @Query() queryParams) {        
        const { row, page, filtro, sort } = queryParams;
        const all = await this.estructuraService.getAllEspecies(parseInt(row), parseInt(page), filtro, sort);
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
    }@Put('/especie/:id')
    async updateEspecie(@Res() res, @Param('id') id: string, @Body() especieDTO: EspecieDTO) {
        const obj = await this.estructuraService.update(id, especieDTO);
        if (!obj) {
            throw new NotFoundException('Especie no encontrada');
        }
        return res.status(HttpStatus.OK).json({
            message: "Especie actualizada correctamente",
            obj
        })
    }

}
