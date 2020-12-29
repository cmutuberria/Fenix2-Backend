import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import {
    Button, Typography, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Tooltip, Avatar
} from "@material-ui/core";
import useStyles from '../../../style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import Dialog from "../../../Components/Dialog"
import { Edit, Delete, Visibility } from "@material-ui/icons";
import SortableCell from '../../../Components/SortableCell';
import TablePagination from '../../../Components/TablePagination';
import TableTextFilter from "../../../Components/TableTextFilter";
import CategoriaUICN from '../../../Constant/CategoriaUICN';
import  showClasificadores from "../../../Utils/showClasificadores";


export default ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [obj, setObj] = useState();
    //table pagination adnd sort
    const [page, setPage] = useState();
    const [total, setTotal] = useState();
    const [row, setRow] = useState();
    const [filtro, setFiltro] = useState("");
    const [sort, setSort] = useState();

    useEffect(() => {
        if (row) {
            list();
        }
    }, [page, row, filtro, sort])

    const list = async () => {
        try {
            dispatch({ type: LOADING_START });
            let params = `row=${row}&page=${page}`
            if (filtro) {
                params += `&filtro=${filtro}`
            }
            if (sort) {
                params += `&sort=${sort}`
            }
            const result = await apiCall(`/estructura/all-Taxones?${params}`, null, null, 'GET');
            const { data, count } = result.data;
            setData(data);
            setTotal(count);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const handleAdd = () => {
        history.push(`/Taxonomia/Especie/Formulario`)
    }
    const handleView = (e, obj) => {
            if (obj && obj.tipo && obj.tipo.vista_ampliada) {
              history.push(`/Taxonomia/Especie/Detalle/${obj._id}`);
            } else {
              history.push(`/Taxonomia/Estructura/Detalle/${obj._id}`);
            }
    }
    const handleEdit = (e, obj) => {
        history.push(`/Taxonomia/Especie/Formulario/${obj._id}`)
    }
    const handleDelete = (e, obj) => {
        setOpenDialog(true);
        setObj(obj);
    }
    const handleCancelDelete = () => {
        setOpenDialog(false);
    }
    const handleOkDelete = async () => {
        try {
            dispatch({ type: LOADING_START });
            setOpenDialog(false);
            const result = await apiCall(`/estructura/${obj._id}`, null, null, 'DELETE');
            dispatch({ type: LOADING_END });
            if (result) {
                list();
                enqueueSnackbar(result.data.message, { variant: 'success' });
            }
        } catch (err) {
            dispatch({ type: LOADING_END });
            if (err.response.data.message) {
                enqueueSnackbar(err.response.data.message, { variant: 'error' });
            } else {
                dispatch({ type: SERVER_ERROR, error: err });
                history.push("/error")
            }
        }
    }

    


    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Listado de Taxones</Typography>
                <Button color="primary" variant="contained"
                    className={classes.btnMargin}
                    onClick={handleAdd}>Nuevo Taxón</Button>
            </div>
            <TableContainer component={Paper}>
                <TableTextFilter setPage={setPage} filtro={filtro} 
                setFiltro={setFiltro} placeholder="Buscar Taxón" />
                <Table aria-label="simple table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <SortableCell columnKey="nombre" columnLabel="Nombre"
                                sort={sort}
                                setSort={setSort} />
                            <SortableCell columnKey="categoria_UICN" columnLabel="UICN"
                                sort={sort}
                                setSort={setSort} />
                            <TableCell>Clasificador(es)</TableCell>
                            <SortableCell columnKey="anno_clasificacion" columnLabel="Clasificado en:"
                                sort={sort}
                                setSort={setSort} />
                            <SortableCell columnKey="origen" columnLabel="Origen"
                                sort={sort}
                                setSort={setSort} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <Tooltip title="Detalle">
                                        <IconButton
                                            onClick={(e) => handleView(e, row)}
                                            color="inherit"
                                            aria-label="Editar"
                                            size="small">
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            onClick={(e) => handleEdit(e, row)}
                                            color="inherit"
                                            aria-label="Editar"
                                            size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Eliminar">
                                        <IconButton
                                            onClick={(e) => handleDelete(e, row)}
                                            color="inherit"
                                            aria-label="Eliminar"
                                            size="small">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    {row.img_individuo&&<Avatar variant='square' src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${row.img_individuo.replace(".","-small.")}`} 
                                    className={classes.avatarLarge} />}
                                </TableCell>                                
                                <TableCell>{row.nombre}</TableCell>                                
                                <TableCell>{row.categoria_UICN?CategoriaUICN.find(elem => elem._id == row.categoria_UICN).label:""}</TableCell>
                                <TableCell>{row.clasificadores?showClasificadores(row.clasificadores):""}</TableCell>
                                <TableCell>{row.anno_clasificacion}</TableCell>
                                <TableCell>{row.origen}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination row={row} setRow={setRow} page={page} setPage={setPage} total={total} />
            </TableContainer>
            <Dialog title="Eliminar Especie" key="dialog"
                body="¿Desea eliminar el Taxón?"
                open={openDialog}
                handlerOk={handleOkDelete}
                handleCancel={handleCancelDelete} />
        </React.Fragment >
    )
}