import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton
} from "@material-ui/core";
import Undo from '@material-ui/icons/Undo'
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import Autocomplete from '@material-ui/lab/Autocomplete';


export default ({ match, history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const id = match.params.id;
    const [obj, setObj] = useState();
    const [tipos, setTipos] = useState([]);
    const [padres, setPadres] = useState([]);
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));


    let { handleChange, handleSubmit, values, errors, handleSelect } = useForm(
        submit,
        validateForm,
        id ? obj : null,
        serverErrors ? serverErrors : null
    );
    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/${id}`, null, null, 'GET');
            const {tipo, padre, nombre}=result.data.obj;
            setObj({tipo, padre, nombre});
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    useEffect(() => { 
        loadTipos()     
        if (id) {
            loadObj(id)
        }
    }, [])
    useEffect(() => { 
        if(obj&&obj.tipo!=values.tipo){
            handleSelect("padre",null)
        }
        if (!obj) {
            handleSelect("padre",null)
        }
        if (values.tipo && values.tipo.nombre!="reino") {            
            loadParentCandidates()            
        }
    }, [values.tipo])
    const loadTipos = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/tipoEstructura/all`, null, null, 'GET');
            setTipos(result.data);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const loadParentCandidates = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/ParentCandidates?tipo=${values.tipo._id}`, null, null, 'GET');            
            setPadres(result.data);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };

    function validateForm(values) {
        let errors = {};
        if (!values.tipo) {
            errors.tipo = "El Tipo es requerido";
        }
        if (values.tipo&&values.tipo.nombre!="reino"&&!values.padre) {
            if(padres.length>0){
                errors.padre = "El padre es requerido";
            }else{
                errors.tipo = "No hay padres disponibles para el tipo seleccionado";
            }
        }
        if (!values.nombre) {
            errors.nombre = "El nombre es requerido";
        }
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START })
            let result = null
            if (id) {
                result = await apiCall(`/estructura/${id}`, values, null, 'PUT')
            } else {
                result = await apiCall(`/estructura`, values, null, 'POST')
            }
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' })
                history.goBack()
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

    const resetData = () => {
        loadObj(id);
    }

    return (
        <div className={classes.rootForm}>
            <div>
                <Typography variant="h3" className={classes.header}>Formulario de Estructura</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
                        {tipos && tipos.length > 0 && <Autocomplete
                                autoComplete
                                options={tipos}
                                getOptionLabel={option => option.label}
                                id="tipo"
                                name="tipo"
                                value={values.tipo || null}
                                onChange={(event, newValue) => {
                                    handleSelect("tipo", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Tipo*"
                                        className={classes.textField}
                                        error={errors.tipo ? true : false}
                                        helperText={errors.tipo} />
                                )}
                            />}
                            {padres && padres.length > 0 && <Autocomplete
                                autoComplete
                                options={padres}
                                getOptionLabel={option => option.nombre +" - "+option.tipo.label}
                                id="padre"
                                name="padre"
                                value={values.padre || null}
                                onChange={(event, newValue) => {
                                    handleSelect("padre", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Padre*"
                                        className={classes.textField}
                                        error={errors.padre ? true : false}
                                        helperText={errors.padre} />
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