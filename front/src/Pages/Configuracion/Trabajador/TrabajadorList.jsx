import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import {
    Button, Typography, TableContainer,
    Table, TableHead, TableRow, TableCell, TableBody, Paper,IconButton, Tooltip
} from "@material-ui/core";
import useStyles from '../../../style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { useSelector } from "react-redux";
import { userAuthenticated } from "../../../Redux/selectors"
import { logout } from '../../../Redux/Actions/auth'
import Dialog from "../../../Components/Dialog"
import { Visibility, Edit, Delete, LockOpen, Lock, PermIdentity } from "@material-ui/icons";
import SortableCell from '../../../Components/SortableCell';
import TablePagination from '../../../Components/TablePagination';
import TableTextFilter from "../../../Components/TableTextFilter";



export default ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const userAuth = useSelector(state => userAuthenticated(state));
    const [openDialog, setOpenDialog] = useState(false);
    const [obj, setObj] = useState();
    //table pagination adnd sort
    const [page, setPage] = useState();
    const [total, setTotal] = useState();
    const [row, setRow] = useState();
    const [filtro, setFiltro] = useState("");
    const [sort, setSort] = useState();

    useEffect(() => {
        list();
    }, [page, row, filtro, sort])

    const list = async () => {
        try {
            dispatch({ type: LOADING_START });
            let params = `jardin=${userAuth.jardin}&row=${row}&page=${page}`
            if (filtro) {
                params += `&filtro=${filtro}`
            }
            if (sort) {
                params += `&sort=${sort}`
            }
            const result = await apiCall(`/trabajador?${params}`, null, null, 'GET');
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
        history.push(`/Configuracion/Trabajador/Formulario`)
    }
    const handleEdit = (e, obj) => {
        history.push(`/Configuracion/Trabajador/Formulario/${obj._id}`)
    }
    const handleDetail = (e, obj) => {
        history.push(`/Configuracion/Trabajador/Detalle/${obj._id}`)
    }
    const handleChangePassword = (e, obj) => {
        history.push(`/Configuracion/Trabajador/CambiarContraseña/${obj._id}`)
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
            const result = await apiCall(`/trabajador/${obj._id}`, null, null, 'DELETE');
            dispatch({ type: LOADING_END });
            if (result) {
                //si el trabajador eliminado es el autenticado hacer logout
                if (userAuth._id === obj._id) {
                    dispatch(logout());
                } else {
                    list();
                }
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
    async function handleLock(e, obj) {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/trabajador/${obj._id}`, { activo: !obj.activo }, null, 'PUT');
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
            }
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            enqueueSnackbar(err.response.data.message, { variant: 'error' });
        } finally {
            list();
        }
    }
    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Listado de Trabajadores</Typography>
                <Button color="primary" variant="contained"
                    className={classes.btnMargin}
                    onClick={handleAdd}>Nuevo Trabajador</Button>
            </div>
            <TableContainer component={Paper}>
                <TableTextFilter setPage={setPage} filtro={filtro} setFiltro={setFiltro} placeholder="Buscar Trabajador"/>
                <Table aria-label="simple table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <SortableCell columnKey="nombre" columnLabel="Nombre"
                                sort={sort} 
                                setSort={setSort} />
                            <SortableCell columnKey="apellidos" columnLabel="Apellidos"
                                sort={sort} 
                                setSort={setSort} />
                            <TableCell>Identificación</TableCell>
                            <SortableCell columnKey="usuario" columnLabel="Usuario"
                                sort={sort} 
                                setSort={setSort} />
                            <SortableCell columnKey="usuario_general" columnLabel="General"
                               sort={sort} 
                               setSort={setSort} />
                            <TableCell>Jardín</TableCell>
                            <SortableCell columnKey="activo" columnLabel="Activo"
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
                                            onClick={(e) => handleDetail(e, row)}
                                            color="inherit"
                                            aria-label="Detalle"
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
                                    <Tooltip title="Cambiar Contraseña">
                                        <IconButton
                                            onClick={(e) => handleChangePassword(e, row)}
                                            color="inherit"
                                            aria-label="Cambiar Contraseña"
                                            size="small">
                                            <PermIdentity fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {row.activo && userAuth._id != row._id && <Tooltip title="Desactivar">
                                        <IconButton
                                            onClick={(e) => handleLock(e, row)}
                                            color="inherit"
                                            aria-label="Desactivar"
                                            size="small">
                                            <Lock fontSize="small" />
                                        </IconButton>
                                    </Tooltip>}
                                    {!row.activo && userAuth._id != row._id && <Tooltip title="Activar">
                                        <IconButton
                                            onClick={(e) => handleLock(e, row)}
                                            color="inherit"
                                            aria-label="Activar"
                                            size="small">
                                            <LockOpen fontSize="small" />
                                        </IconButton>
                                    </Tooltip>}
                                </TableCell>
                                <TableCell>{row.nombre}</TableCell>
                                <TableCell>{row.apellidos}</TableCell>
                                <TableCell>{row.nro_identificacion}</TableCell>
                                <TableCell>{row.usuario}</TableCell>
                                <TableCell><Typography color={row.usuario_general ? "primary" : "error"}>
                                    {row.usuario_general ? "Si" : "No"}
                                </Typography></TableCell>
                                <TableCell>{row.jardin ? row.jardin.nombre : ""}</TableCell>
                                <TableCell><Typography color={row.activo ? "primary" : "error"}>
                                    {row.activo ? "Si" : "No"}
                                </Typography></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination row={row} setRow={setRow} page={page} setPage={setPage} total={total}/>
            </TableContainer>
            <Dialog title="Eliminar Trabajador" key="dialog"
                body="¿Desea eliminar el trabajador?"
                open={openDialog}
                handlerOk={handleOkDelete}
                handleCancel={handleCancelDelete} />
        </React.Fragment >
    )
}