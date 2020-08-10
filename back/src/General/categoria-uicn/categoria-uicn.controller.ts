import {
    Controller, Get, Post, Delete, Put,
    Res, HttpStatus, Body, Param, NotFoundException, Query
} from '@nestjs/common';

const categorias = [{
    _id: "extinto",
    label: "Extinto"
}, {
    _id: "extinto_naturaleza",
    label: "Extinto en la Naturaleza"
}, {
    _id: "peligro_critico",
    label: "En Peligro Crítico"
}, {
    _id: "peligro",
    label: "En Peligro"
}, {
    _id: "vulnerable",
    label: "Vulnerable"
}, {
    _id: "casi_amenazado",
    label: "Casi Amenazado"
}, {
    _id: "prepocupacion_menor",
    label: "Preocupación Menor"
}, {
    _id: "no_evaluado",
    label: "No Evaluado"
}, {
    _id: "sin_amenaza",
    label: "Sin Amenaza"
}]
@Controller('categoria-uicn')
export class CategoriaUICNController {

    @Get('/')
    async getAll(@Res() res) {
        return res.status(HttpStatus.OK).json(categorias)
    }
}
