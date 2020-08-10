import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Card, CardContent, Grid,
    Button, IconButton, CardActions, Paper, List, ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "@material-ui/core";
import useStyles from '../../../style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Edit, Delete, AddBox, KeyboardArrowUp, Visibility } from '@material-ui/icons';
import { loading } from "../../../Redux/selectors";
import CategoriaUICN from '../../../Constant/CategoriaUICN';
import Sinonimias from "./_sinonimias";
import NombresComunes from "./_nombresComunes";
import Childrens from "./_childrens";
import Usos from "./Usos";



export default ({ history, match }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const id = match.params.id;
    const [obj, setObj] = useState();
    const [parents, setParents] = useState([]);
    const [childrens, setChildrens] = useState();
    const Loading = useSelector(state => loading(state));
    const { enqueueSnackbar } = useSnackbar();


    useEffect(() => {
        if (id) {
            loadObj(id);
        }
    }, [id])


    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/especie/${id}`, null, null, 'GET');
            const especie = result.data.obj
            setObj(especie)
            const estructura = await apiCall(`/estructura/OneWithParentsAndChildrens/${especie.estructura._id}`, null, null, 'GET');
            setParents(estructura.data.parents)
            setChildrens(estructura.data.childrens)
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };

    const handleDelete = async (obj) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/especie/${obj._id}`, null, null, 'DELETE');
            dispatch({ type: LOADING_END });
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
                history.goBack()
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
    const renderParents = () => {
        return <List dense>
            {parents.map((obj) => <ListItem key={obj._id} >
                <ListItemText primary={obj.nombre} secondary={obj.tipo.label} />
                <ListItemSecondaryAction >
                    <IconButton aria-label="Detalle" edge="end"
                        onClick={(e) => handleView(obj)}>
                        <Visibility fontSize="small" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)}
        </List>

    }

    const handleView = (obj) => {
        history.push(`/Taxonomia/Estructura/Detalle/${obj._id}`)
    }
    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Detalle de Especie</Typography>
            </div>
            <Card className={classes.card}>
                <CardContent>
                    {obj && <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <List>
                                <ListItem divider key={obj._id}>
                                    <ListItemText primary={<Typography variant="h5">{obj.nombre}</Typography>}
                                        secondary={obj.estructura.tipo.label}>
                                    </ListItemText>
                                </ListItem>
                                <ListItem key="categoria_UICN">
                                    <ListItemText primary={CategoriaUICN.find(elem => elem._id == obj.categoria_UICN).label}
                                        secondary="Categoría Amenaza UICN">
                                    </ListItemText>
                                </ListItem>
                               
                                <ListItem key="clasificador">
                                    <ListItemText primary={obj.clasificador.nombre}
                                        secondary="Clasificador">
                                    </ListItemText>
                                </ListItem>
                                <ListItem key="anno_clasificacion">
                                    <ListItemText primary={obj.anno_clasificacion}
                                        secondary="Año Clasificación">
                                    </ListItemText>
                                </ListItem>
                                <ListItem key="origen">
                                    <ListItemText primary={obj.origen}
                                        secondary="Origen">
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={3}>
                        <div className={classes.detailHeader}>
                            <Typography variant="h6" >Clasificación</Typography>
                        </div>
                            <Paper variant="outlined" >
                                {renderParents()}
                            </Paper>
                        </Grid>
                        {<Grid item xs={3}>
                            <Sinonimias obj={obj} />
                        </Grid>}
                        {<Grid item xs={3}>
                            <NombresComunes obj={obj} />
                        </Grid>}
                        {<Grid item xs={6}>
                            <Usos obj={obj} />
                        </Grid>}
                        {childrens && <Grid item xs={6}>
                            <Childrens obj={obj} childrens={childrens} />
                        </Grid>}
                    </Grid>}

                </CardContent>
                {obj && obj._id && <CardActions className={classes.detailActions}>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={() => history.push(`/Taxonomia/Especie/Formulario/${obj._id}`)}>
                        Editar</Button>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={(e) => handleDelete(obj)}>Eliminar</Button>
                </CardActions>}
            </Card>
        </React.Fragment >
    )
}