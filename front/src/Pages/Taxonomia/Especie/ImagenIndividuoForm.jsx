import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton, Grid
} from "@material-ui/core";
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import { FormHelperText } from '@material-ui/core';

export default ({ match, history }) => {
    const id = match.params.id;
    const dispatch = useDispatch();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));

    let { handleChange, handleSubmit, values, errors, handleSelect } = useForm(
        submit,
        validateForm,
         null,
         null
    );
   

    function validateForm(values) {
        let errors = {};   
        if (!values.img_individuo) {
            errors.img_individuo = "Debe seleccionar una imagen";
        }     
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START })
            const headers = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            const data = new FormData()
            data.append('_id',id)
            data.append('img_individuo',values.img_individuo)
            let result = null
            result = await apiCall(`/estructura/img-individuo`, data, headers, 'POST')            
            dispatch({ type: LOADING_END });
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' })
                history.goBack()
            }
        } catch (err) {
            dispatch({ type: LOADING_END });
        }
    }

    

    const handleFiles=(e)=> { 
        const file = e.target.files[0]
        const name = e.target.name
        handleSelect(name, file)
        if (file!=null) {            
            var reader = new FileReader()
            reader.onload = function(){
                var output = document.getElementById('output_'+name);
                output.src = reader.result
            };
            reader.readAsDataURL(file)
        }
      }       
    return (
        <div className={classes.rootForm}>
            <div>
                <Typography variant="h3" className={classes.header}>Subir Imagen Representativa</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                        <CardContent>
                            <Grid container spacing={3}>                                
                                <Grid item xs={12}>                                    
                                <label htmlFor="img_individuo">
                                    <input
                                        style={{ display: 'none' }}
                                        id="img_individuo"
                                        name="img_individuo"
                                        type="file"
                                        onChange={handleFiles}
                                        accept="image/*"
                                    />
                                    <div className={classes.textFieldFile}>
                                        <Button color="primary"  component="span">
                                            Cargar Imagen Representativa
                                        </Button>
                                        {errors.img_individuo&&<FormHelperText error>{errors.img_individuo}</FormHelperText>}
                                        <img id="output_img_individuo" width="350" height="350"></img>
                                    </div>
                                </label>                                                                                                                
                                </Grid>
                            </Grid>                            
                        </CardContent>
                        <CardActions className={classes.spaceBetween}>
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}>Salvar</Button>
                            <Button variant="contained" color="primary" disabled={Loading} onClick={()=> history.goBack()}>Volver</Button>
                        </CardActions>
                    </form>
                </Card>
            </div>            
        </div>
    )
}