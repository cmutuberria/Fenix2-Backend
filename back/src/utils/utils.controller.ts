import { Controller, UseGuards, Post, Request, Body, Get, Res, HttpStatus, Query } from '@nestjs/common';

@Controller('utils')
export class UtilsController {
    constructor() { }

    @Get('/img')
    getImg(@Query() imgPath, @Res() res ){
        return res.sendFile(imgPath.path, {root:'./'})
    }
}
