import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton
} from "@material-ui/core";
import Undo from '@material-ui/icons/Undo'
import useStyles from "../../../style";
import { loading } from "../../../Redux/selectors";


export default ({ title, id, values, errors, handleSubmit,  handleChange, resetData }) => {
    const classes = useStyles();  
    const Loading = useSelector(state => loading(state));  

    return (
        <div className={classes.rootForm}>
            <div>
    <Typography variant="h3" className={classes.header}>{title}</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
                            <TextField
                                className={classes.textField}
                                label="Acrónimo*"
                                name="acronimo"
                                id="acronimo"
                                onChange={handleChange}
                                value={values.acronimo || ''}
                                error={errors.acronimo ? true : false}
                                helperText={errors.acronimo}
                            />
                            <TextField
                                className={classes.textField}
                                label="Nombre"
                                name="nombre"
                                id="nombre"
                                onChange={handleChange}
                                value={values.nombre || ''}
                                error={errors.nombre ? true : false}
                                helperText={errors.nombre}
                            />
                        </CardContent>
                        <CardActions className={classes.actions}>
                            {id && <IconButton onClick={resetData} disabled={Loading}><Undo /></IconButton>}
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}>Salvar</Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </div>

    )
}