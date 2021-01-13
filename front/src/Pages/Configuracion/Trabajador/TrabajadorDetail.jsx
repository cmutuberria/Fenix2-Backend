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
import { FormattedMessage, useIntl  } from "react-intl";



export default ({ history, match }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const id = match.params.id;
    const [obj, setObj] = useState({});
    const Loading = useSelector(state => loading(state));
  const intl = useIntl();


    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/trabajador/${id}`, null, null, 'GET');
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
                <Typography variant="h5" className={classes.title}><FormattedMessage id="page.trabajadores.detail.title" /></Typography>
            </div>
            <Card className={classes.card}>
                <CardContent className={classes.detail}>
                    <List>
                        <ListItem divider>
                            <ListItemText primary={<Typography variant="h5">{obj.nombre}</Typography>}
                                secondary={obj.apellidos}>
                            </ListItemText>
                        </ListItem>
                        {obj.usuario_general && <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.label.general' })}>
                            </ListItemText>
                        </ListItem>}
                        {obj.jardin && <ListItem >
                            <ListItemText primary="Jardín"
                                secondary={obj.jardin.nombre}>
                            </ListItemText>
                        </ListItem>}
                    </List>
                    <List>
                        <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.label.nro_identificacion' })+":"} secondary={obj.nro_identificacion} />
                        </ListItem>
                        <ListItem dense>
                            <ListItemText primary="Roles:" secondary={
                                obj.roles && obj.roles.map((rol, i) => {
                                    return (i > 0) ? ", " + rol : rol
                                })} multiline="true"/>

                        </ListItem>
                        <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.attr.usuario' })+":"} secondary={obj.usuario} />
                        </ListItem>
                    </List>
                    <List>
                        <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.attr.direccion' })+":"} secondary={obj.direccion} />
                        </ListItem>
                        <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.attr.email' })+":"} secondary={obj.email} />
                        </ListItem>
                        <ListItem >
                            <ListItemText primary={intl.formatMessage({ id: 'trabajadores.attr.telefono' })+":"} secondary={obj.telefono} />
                        </ListItem>
                    </List>
                </CardContent>
                {obj._id && <CardActions className={classes.detailActions}>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={() => history.push(`/Configuracion/Trabajador/Formulario/${obj._id}`)}>
                        Editar</Button>
                    <Button variant="contained" color="primary" disabled={Loading}
                        onClick={() => history.push(`/Configuracion/Trabajador/CambiarContraseña/${obj._id}`)}>
                        Cambiar Contraseña</Button>
                </CardActions>}
            </Card>

        </React.Fragment >
    )
}