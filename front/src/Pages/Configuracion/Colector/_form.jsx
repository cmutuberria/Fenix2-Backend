import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton
} from "@material-ui/core";
import Undo from '@material-ui/icons/Undo'
import useStyles from "../../../style";
import { loading } from "../../../Redux/selectors";
import { FormattedMessage, useIntl } from "react-intl";



export default ({ title, id, values, errors, handleSubmit,  handleChange, resetData }) => {
    const classes = useStyles();  
    const Loading = useSelector(state => loading(state));  
    const intl = useIntl();

    return (
        <div className={classes.rootForm}>
            <div>
    <Typography variant="h3" className={classes.header}>{title}</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({ id: "colectores.attr.acronimo" })+"*"}
                                name="acronimo"
                                id="acronimo"
                                onChange={handleChange}
                                value={values.acronimo || ''}
                                error={errors.acronimo ? true : false}
                                helperText={errors.acronimo}
                            />
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({ id: "colectores.attr.nombre" })}
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
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}> <FormattedMessage id="btn.save" /></Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </div>

    )
}