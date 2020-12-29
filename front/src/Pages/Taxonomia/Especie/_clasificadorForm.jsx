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

import _form from './_form';


export default ({ match, history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const id = match.params.id;
    const [obj, setObj] = useState({ nombre: "", descripcion: "" })
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
   

    let { handleChange, handleSubmit, values, errors } = useForm(
        submit,
        validateForm,
        id ? obj : null,
        serverErrors ? serverErrors : null
    );
    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/colector/${id}`, null, null, 'GET');
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
        if (!values.acronimo) {
            errors.acronimo = "El Acrónimo es requerido";
        }
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START });
            let result = null;
            if (id) {
                result = await apiCall(`/colector/${id}`, values, null, 'PUT');
            } else {
                result = await apiCall(`/colector`, values, null, 'POST');
            }
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
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
        <_form title={"Formulario de Clasificador/Colector/Introductor"} 
        id = {match.params.id}
        values={values} 
        errors={errors} handleSubmit={handleSubmit} 
         handleChange={handleChange} resetData={resetData}/>

    )
}