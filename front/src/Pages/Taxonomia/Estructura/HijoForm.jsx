import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton, Paper, Grid
} from "@material-ui/core";
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import Autocomplete from '@material-ui/lab/Autocomplete';


export default ({ obj, padre, loadChildrens }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    //const [obj, setObj] = useState();
    const [tipos, setTipos] = useState([]);
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (obj) {
            setValues(obj)
        }
    }, [obj])

    const handleChange = event => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    function validateForm() {
        let errors1 = {};
        if (!values.tipo) {
            errors1.tipo = "El Tipo es requerido";
        }

        if (!values.nombre) {
            errors1.nombre = "El nombre es requerido";
        }
        setErrors(errors1);
        return errors1;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (Object.keys(validateForm()).length === 0) {
                dispatch({ type: LOADING_START })
                const obj_submit = { padre, ...values };
                let result = null
                if (obj) {
                    result = await apiCall(`/estructura/${obj._id}`, obj_submit, null, 'PUT')
                } else {
                    result = await apiCall(`/estructura`, obj_submit, null, 'POST')
                }
                if (result) {
                    enqueueSnackbar(result.data.message, { variant: 'success' })
                    loadChildrens()
                    resetData()
                }
                dispatch({ type: LOADING_END });
            }
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
                //history.push("/error")
            }

        }
    }

    const resetData = () => {
        setValues({});
        setErrors({});
    }

    useEffect(() => {
        if (padre) {
            loadTipos()
        }
    }, [])

    const loadTipos = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/tipoEstructura/Childrens/${padre.tipo._id}`, null, null, 'GET');
            setTipos(result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            //history.push("/error")
        }
    };
    


    return (
        
            <div>
                <Typography variant="h6" >Formulario de Estructura Hijo</Typography>
                
                        <Grid>
                    <form onSubmit={handleSubmit} noValidate>
                            {tipos && tipos.length > 0 && <Autocomplete
                                autoComplete
                                options={tipos}
                                getOptionLabel={option => option.label}
                                id="tipo"
                                name="tipo"
                                value={values.tipo || null}
                                onChange={(event, newValue) => {
                                    handleChange({target:{ name: "tipo", value: newValue }})
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Tipo*"
                                        className={classes.textField}
                                        error={errors.tipo ? true : false}
                                        helperText={errors.tipo} />
                                )}
                            />}
                            <TextField
                                className={classes.textField}
                                label="Nombre*"
                                name="nombre"
                                id="nombre"
                                onChange={handleChange}
                                value={values.nombre || ''}
                                error={errors.nombre ? true : false}
                                helperText={errors.nombre}
                            />
                        
                        <Grid className={classes.left}>
                            <Button variant="contained" type="submit" color="primary" size="small" disabled={Loading}>Salvar</Button>
                        </Grid>
                    </form>
                </Grid>
            </div>       

    )
}
