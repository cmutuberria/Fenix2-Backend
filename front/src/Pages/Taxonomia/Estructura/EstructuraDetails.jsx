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
import HijoForm from "./HijoForm";
import Childrens from "./_childrens";




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
            //padres e hijos
        }
    }, [id])


    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/OneWithParentsAndChildrens/${id}`, null, null, 'GET');
            setObj(result.data.obj)
            setParents(result.data.parents)
            setChildrens(result.data.childrens)
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const loadChildrens = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/Childrens/${id}`, null, null, 'GET');
            setChildrens(result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            //history.push("/error")
        }
    };

    const handleDelete = async (obj, permanecer) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/${obj._id}`, null, null, 'DELETE');
            dispatch({ type: LOADING_END });
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
                if (permanecer) {
                    loadChildrens();
                } else {
                    history.push("/Taxonomia/Estructura")
                }
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
            {parents.map((obj) => <ListItem key={obj._id}>
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
        if (obj&&obj.tipo&&obj.tipo.nombre=="Especie") {
            history.push(`/Taxonomia/Especie/Detalle/${obj._id}`)
        }else{
            history.push(`/Taxonomia/Estructura/Detalle/${obj._id}`)
        }
    }
    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Detalle de Estructura</Typography>
            </div>
            <Card className={classes.card}>
                <CardContent>
                    {obj && <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <List>
                                <ListItem divider key={obj._id}>
                                    <ListItemText primary={<Typography variant="h5">{obj.nombre}</Typography>}
                                        secondary={obj.tipo.label}>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={classes.detailHeader}>
                                <Typography variant="h6" className={classes.padd1}>Clasificación</Typography>
                            </div>
                            <Paper variant="outlined" >
                                {renderParents()}
                            </Paper>
                        </Grid>                        
                        {childrens && <Grid item xs={4}>
                            <Childrens obj={obj} childrens={childrens}/>
                            {/* <Childrens obj={obj} childrens={childrens} handleView={handleView()}/> */}
                        </Grid>}
                    </Grid>}
                </CardContent>
                {obj && obj._id && <CardActions className={classes.detailActions}>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={() => history.push(`/Taxonomia/Estructura/Formulario/${obj._id}`)}>
                        Editar</Button>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={(e) => handleDelete(obj, false)}>Eliminar</Button>
                </CardActions>}
            </Card>
        </React.Fragment >
    )
}