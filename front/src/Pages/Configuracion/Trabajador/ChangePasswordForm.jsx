import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardActions, Button, TextField, Typography, } from "@material-ui/core";
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import { FormattedMessage, useIntl  } from "react-intl";


export default ({ match, history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const id = match.params.id;
    const [obj, setObj] = useState({ nombre: "desconocido" })
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));
    const intl = useIntl();

    let { handleChange, handleSubmit, values, errors } = useForm(
        submit,
        validateForm,
        null,
        serverErrors ? serverErrors : null
    );
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
        if (id) {
            loadObj(id);
        }
    }, [])

    function validateForm(values) {
        let errors = {};
        if (!values.password) {
            errors.password = "La Contraseña es requerida";
        }
        if (values.password2 !== values.password) {
            errors.password = "Las Contraseñas con coinciden";
            errors.password2 = "Las Contraseñas con coinciden";
        }
        /* if (values.password.length<7) {
            errors.password = "La Contraseña debe tener al menos 7 carácteres";
            errors.password2 = "La Contraseña debe tener al menos 7 carácteres";
         }    */
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/trabajador/changePassword/${id}`, { password: values.password }, null, 'PUT');
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
                history.goBack();
            }
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });

            if (err.response.data.errors) {
                Object.keys(err.response.data.errors).map((elem) => {
                    errors = {
                        ...errors,
                        [elem]: err.response.data.errors[elem].message
                    }

                })
                setServerErrors(errors);
            } else {
                dispatch({ type: SERVER_ERROR, error: err });
                history.push("/error")

            }
        }
    }

    return (
        <div className={classes.rootForm}>
            <div>
                <Typography variant="h3" className={classes.header}><FormattedMessage id="page.trabajadores.change_pass.title" /></Typography>
                <Typography variant="h6" className={classes.header}>{obj.nombre}</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
                            <TextField
                                type="password"
                                className={classes.textField}
                                label={intl.formatMessage({ id: 'trabajadores.attr.password' })+"*"}
                                name="password"
                                id="password"
                                onChange={handleChange}
                                value={values.password || ''}
                                error={errors.password ? true : false}
                                helperText={errors.password}
                            />
                            <TextField
                                type="password"
                                className={classes.textField}
                                label={intl.formatMessage({ id: 'trabajadores.attr.password_repeat' })+"*"}
                                name="password2"
                                id="password2"
                                onChange={handleChange}
                                value={values.password2 || ''}
                                error={errors.password2 ? true : false}
                                helperText={errors.password2}
                            />
                        </CardContent>
                        <CardActions className={classes.actions}>
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}><FormattedMessage id="btn.save" /></Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
        </div>

    )
}