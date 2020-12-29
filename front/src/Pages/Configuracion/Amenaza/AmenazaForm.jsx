import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText
} from "@material-ui/core";
import Undo from '@material-ui/icons/Undo'
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";



export default ({ match, history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const id = match.params.id;
    const [obj, setObj] = useState({ nombre: "", descripcion: "" })
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));

    let { handleChange, handleSubmit, values, errors } = useForm(
        submit,
        validateForm,
        id ? obj : null,
        serverErrors ? serverErrors : null
    );
    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/amenaza/${id}`, null, null, 'GET');
            const data= result.data.obj
            setObj({
                ...data,
                tipo:data.tipo?"1":"0",
            });
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
        if (!values.nombre) {
            errors.nombre = "El Nombre es requerido";
        }
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START });
            let result = null;
            if (id) {
                result = await apiCall(`/amenaza/${id}`, values, null, 'PUT');
            } else {
                result = await apiCall(`/amenaza`, values, null, 'POST');
            }
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
                history.push("/Configuracion/Amenazas")
                //history.goBack();
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
                <Typography variant="h3" className={classes.header}>Formulario de Amenaza</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
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
                            <FormControl
                      component="fieldset"
                      className={classes.textField}
                    >
                      <FormLabel component="legend">Tipo</FormLabel>
                      <RadioGroup
                        row
                        name="tipo"
                        value={values.tipo || "1"}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Amenaza"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Estés"
                        />
                      </RadioGroup>
                      <FormHelperText>
                        {errors.tipo}
                      </FormHelperText>
                    </FormControl>

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