import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Res,
  HttpStatus,
  Body,
  Param,
  NotFoundException,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { EstructuraService } from './estructura.service';
import { EstructuraDTO } from './estructura.dto';
import { EspecieDTO } from './especie.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as Jimp from 'jimp';

const storageOptions = diskStorage({
  destination: './uploads/taxonomia',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

// You may want to move this function into a separate file then import it to make it cleaner
function generateFilename(file) {
  return `${Date.now()}${extname(file.originalname)}`;
}

@Controller('estructura')
export class EstructuraController {
  constructor(private estructuraService: EstructuraService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: storageOptions,
    }),
  )
  uploadFile(@Res() res, @Body() estructuraDTO: any, @UploadedFiles() files) {
    const img_individuo_file = files[0];
    const img_herbario_file = files[1];
    estructuraDTO.img_individuo = img_individuo_file
      ? img_individuo_file.path
      : '';
    estructuraDTO.img_herbario = img_herbario_file
      ? img_herbario_file.path
      : '';
    console.log('estructuraDTO', estructuraDTO);
    console.log('files', files);

    return res.status(HttpStatus.OK).json({
      message: 'Estructura creada correctamente',
    });
  }

  @Post('img-individuo')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: storageOptions,
    }),
  )
  async imgIndividuo(@Res() res, @Body() data: any, @UploadedFiles() files) {
    const img_individuo_file = files[0];
    Jimp.read(img_individuo_file.path, (err, img) => {
        if (err) throw err;
        img
          .resize(100, 100)
          .write(img_individuo_file.path.replace(".","-small."));
          
      });
    const especieDTO = new EspecieDTO();
    especieDTO.img_individuo = img_individuo_file ? img_individuo_file.path : '';
    const oldObj = await this.estructuraService.getOne(data._id);
    if (oldObj && oldObj.img_individuo != null) {
      fs.unlink(oldObj.img_individuo, err => {
          if (err) {
              console.error(err);
            }
        });
       fs.unlink(oldObj.img_individuo.replace(".","-small."), e=>{console.log(e)})
    }
    const obj = await this.estructuraService.update(data._id, especieDTO);

    return res.status(HttpStatus.OK).json({
      message: `Imagen asociada correctamente`,
      obj,
    });
  }

  @Post('img-herbario')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: storageOptions,
    }),
  )
  async imgHerbario(@Res() res, @Body() data: any, @UploadedFiles() files) {
    const img_herbario_file = files[0];
    Jimp.read(img_herbario_file.path, (err, img) => {
        if (err) throw err;
        img
          .resize(100, 100)
          .write(img_herbario_file.path.replace(".","-small."));         
          
      });
    const especieDTO = new EspecieDTO();
    especieDTO.img_herbario = files[0] ? files[0].path : '';
    const oldObj = await this.estructuraService.getOne(data._id);
    if (oldObj && oldObj.img_herbario != null) {
      fs.unlink(oldObj.img_herbario, err => {
        if (err) {
          console.error(err);
        }
      });
      fs.unlink(oldObj.img_herbario.replace(".","-small."), e=>{console.log(e)})
    }
    const obj = await this.estructuraService.update(data._id, especieDTO);

    return res.status(HttpStatus.OK).json({
      message: `Imagen asociada correctamente`,
      obj,
    });
  }

  @Post('add-imagen-galeria')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: storageOptions,
    }),
  )
  async addImagen(@Res() res, @Body() data: any, @UploadedFiles() files) {
    const objOld = await this.estructuraService.getOne(data._id);
    if (!objOld) {
      throw new NotFoundException('Estructura no encontrada');
    } 
    objOld.galeria.push(files[0].path) 
    const obj = await this.estructuraService.update(data._id, objOld);
    return res.status(HttpStatus.OK).json({
      message: `Imagen adicionada correctamente`,
      obj,
    });
  }
  
  @Post('delete-imagen-galeria')
  async deleteImagen(@Res() res, @Body() data: any) {
    const objOld = await this.estructuraService.getOne(data._id);
    if (!objOld) {
      throw new NotFoundException('Estructura no encontrada');
    }  
    objOld.galeria=objOld.galeria.filter((elem)=>elem!=data.path)     
    fs.unlink(data.path, err => {
      if (err) {
        console.error(err);
      }
    });
    const obj = await this.estructuraService.update(data._id, objOld);
    return res.status(HttpStatus.OK).json({
      message: `Imagen eliminada correctamente`,
      obj,
    });
  }

  @Post('/')
  async create(@Res() res, @Body() estructuraDTO: EstructuraDTO) {
    const obj = await this.estructuraService.create(estructuraDTO);
    return res.status(HttpStatus.OK).json({
      message: obj.tipo.label+' creado(a) correctamente',
      obj,
    });
  }
  @Post('/especie')
  async createEspe(@Res() res, @Body() especieDTO: EspecieDTO) {
    const obj = await this.estructuraService.create(especieDTO);
    return res.status(HttpStatus.OK).json({
      message: obj.tipo.label+' creado(a) correctamente',
      obj,
    });
  }

  @Get('/')
  async getAll(@Res() res, @Query() queryParams) {
    const { row, page, filtro, sort, tipo } = queryParams;
    const all = await this.estructuraService.getAll(
      parseInt(row),
      parseInt(page),
      filtro,
      sort,
      tipo,
    );
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/all-especies')
  async getAllEspecies(@Res() res, @Query() queryParams) {
    const { row, page, filtro, sort } = queryParams;
    const all = await this.estructuraService.getAllEspecies(
      parseInt(row),
      parseInt(page),
      filtro,
      sort,
    );
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/all-Taxones')
  async getAllTaxones(@Res() res, @Query() queryParams) {
    const { row, page, filtro, sort } = queryParams;
    const all = await this.estructuraService.getAllTaxones(
      parseInt(row),
      parseInt(page),
      filtro,
      sort,
    );
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/all-Childrens')
  async getAllChildrens(@Res() res, @Query() queryParams) {
    const { row, page, filtro, sort, _id } = queryParams;
    const all = await this.estructuraService.getAllChildrens(
      parseInt(row),
      parseInt(page),
      filtro,
      sort,
      _id
    );
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/filter')
  async filter(@Res() res, @Query() queryParams) {
    const { row, page, filtro, sort } = queryParams;
    const all = await this.estructuraService.filter(
      parseInt(row),
      parseInt(page),
      filtro
    );
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/AllTipo')
  async AllTipo(@Res() res, @Query() queryParams) {
    const { tipo } = queryParams;
    const all = await this.estructuraService.allTipo(tipo);
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/All')
  async All(@Res() res) {
    const all = await this.estructuraService.all();
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/Root')
  async Root(@Res() res) {
    const all = await this.estructuraService.root();
    return res.status(HttpStatus.OK).json(all);
  }
  @Get('/ParentCandidates')
  async ParentCandidates(@Res() res, @Query() queryParams) {
    const { tipo } = queryParams;
    const all = await this.estructuraService.parentCandidates(tipo);
    return res.status(HttpStatus.OK).json(all);
  }

  @Get('/Childrens/:id')
  async getChildrens(@Res() res, @Param('id') id: string) {
    const obj = await this.estructuraService.getChildrens(id);
    if (!obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json({
      obj,
    });
  }
  @Get('/Parents/:id')
  async getParents(@Res() res, @Param('id') id: string) {
    const obj = await this.estructuraService.getParents(id);
    // const obj = await this.estructuraService.getOne(id);
    if (!obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json({
      obj,
    });
  }
  @Get('/OneWithParentsAndChildrens/:id')
  async getOneWithParentsAndChildrens(@Res() res, @Param('id') id: string) {
    const obj = {
      obj: await this.estructuraService.getOne(id),
      parents: await this.estructuraService.getParents(id),
      childrens: await this.estructuraService.getChildrens(id),
    };
    if (!obj.obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json(obj);
  }
  @Get('/:id')
  async getOne(@Res() res, @Param('id') id: string) {
    const obj = await this.estructuraService.getOne(id);
    if (!obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json({
      obj,
    });
  }

  @Delete('/:id')
  async delete(@Res() res, @Param('id') id: string) {
    const obj = await this.estructuraService.delete(id);
    if (!obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json({
      message: obj.tipo.label+' eliminado(a) correctamente',
      obj,
    });
  }

  @Put('/:id')
  async update(
    @Res() res,
    @Param('id') id: string,
    @Body() estructuraDTO: EstructuraDTO,
  ) {
    const obj = await this.estructuraService.update(id, estructuraDTO);
    if (!obj) {
      throw new NotFoundException('Estructura no encontrada');
    }
    return res.status(HttpStatus.OK).json({
      message: obj.tipo.label+' actualizado(a) correctamente',
      obj,
    });
  }
  @Put('/especie/:id')
  async updateEspecie(
    @Res() res,
    @Param('id') id: string,
    @Body() especieDTO: EspecieDTO,
  ) {
    const obj = await this.estructuraService.update(id, especieDTO);
    if (!obj) {
      throw new NotFoundException('Taxón no encontrado');
    }
    return res.status(HttpStatus.OK).json({
      message: obj.tipo.label+' actualizado(a) correctamente',
      obj,
    });
  }
}
