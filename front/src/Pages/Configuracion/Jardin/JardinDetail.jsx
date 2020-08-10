import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';

import {
    Typography, Card, CardContent, Button, CardActions,
    List, ListItem, ListItemText
} from "@material-ui/core";
import useStyles from '../../../style'
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { loading } from "../../../Redux/selectors";



export default ({ history, match }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const id = match.params.id;
    const [obj, setObj] = useState({});
    const Loading = useSelector(state => loading(state));

    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/jardin/${id}`, null, null, 'GET');
            setObj(result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    useEffect(() => {
        loadObj(id);
    }, [])

    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Detalle del Jardín</Typography>
            </div>
            <Card className={classes.card}>
                <CardContent className={classes.detail}>
                    <List>
                        <ListItem divider>
                            <ListItemText primary={<Typography variant="h5">{obj.nombre}</Typography>}
                                secondary={obj.es_privado?"Privado":"Institucional"}>
                            </ListItemText>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem >
                            <ListItemText primary={"País:"} secondary={obj.pais?obj.pais.nombre:""}>
                            </ListItemText>
                        </ListItem>
                        <ListItem >
                            <ListItemText primary="Tipo Colección:" secondary={obj.tipo_coleccion}>
                            </ListItemText>
                        </ListItem>
                        <ListItem >
                            <ListItemText primary={obj.activo?"Activo":"Inactivo"}>
                            </ListItemText>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem >
                            <ListItemText primary="Dirección Particular:" secondary={obj.direccion} />
                        </ListItem>
                        <ListItem >
                            <ListItemText primary="Email:" secondary={obj.email} />
                        </ListItem>
                        <ListItem >
                            <ListItemText primary="Teléfono:" secondary={obj.telefono} />
                        </ListItem>
                    </List>
                </CardContent>
                {obj._id && <CardActions className={classes.detailActions}>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={() => history.push(`/Configuracion/Jardin/Formulario/${obj._id}`)}>
                        Editar</Button>
                </CardActions>}
            </Card>

        </React.Fragment >
    )
}