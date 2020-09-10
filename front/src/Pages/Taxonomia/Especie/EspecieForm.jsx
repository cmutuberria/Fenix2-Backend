import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Card, CardContent, CardActions, Button,
    TextField, Typography, IconButton, Grid
} from "@material-ui/core";
import Undo from '@material-ui/icons/Undo'
import useStyles from "../../../style";
import useForm from '../../../useForm';
import { useSnackbar } from 'notistack';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CategoriaUICN from '../../../Constant/CategoriaUICN';
import { AddToPhotos } from "@material-ui/icons";
import Dialog from "../../../Components/Dialog";
import uniqueID from "../../../Utils/uniqueID";
var fs = require('fs');

export default ({ match, history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const id = match.params.id;
    const [obj, setObj] = useState();
    const [clasificadores, setClasificadores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [padres, setPadres] = useState([]);
    const [serverErrors, setServerErrors] = useState()
    const { enqueueSnackbar } = useSnackbar();
    const Loading = useSelector(state => loading(state));
    const [openDialog, setOpenDialog] = useState(false);
    const [nuevoClasificador, setNuevoClasificador] = useState("valor inicial");



    let { handleChange, handleSubmit, values, errors, handleSelect } = useForm(
        submit,
        validateForm,
        id ? obj : null,
        serverErrors ? serverErrors : null
    );
    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START })
            const result = await apiCall(`/estructura/${id}`, null, null, 'GET')
            const objResp = result.data.obj
            setObj({
                ...objResp,
                categoria_UICN: CategoriaUICN.find(elem => elem._id == objResp.categoria_UICN),
            })
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    useEffect(() => {
        loadTipoEspecie()
        loadClasificadores()
        loadCategorias()
        if (id) {
            loadObj(id)
        }
    }, [])
    useEffect(() => {
        if (values.tipo) {
            loadParentCandidates()
        }
    }, [values.tipo])
    const loadTipoEspecie = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/tipoEstructura/especie`, null, null, 'GET');
            handleSelect("tipo", result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const loadClasificadores = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/colector/all`, null, null, 'GET');
            setClasificadores(result.data.all)
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
    const loadCategorias = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/categoria-uicn/`, null, null, 'GET');
            setCategorias(result.data);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };

    function validateForm(values) {
        let errors = {};
        if (!values.padre) {
            errors.padre = "El padre es requerido";
        }
        if (!values.nombre) {
            errors.nombre = "El nombre es requerido";
        }
        if (!values.categoria_UICN) {
            errors.nombre = "La categoría de amenaza UICN es requerida";
        }
        return errors;
    }
    async function submit() {
        try {
            dispatch({ type: LOADING_START })
            const objSubmit = {
                ...values,
                categoria_UICN: values.categoria_UICN._id,
            };
            const headers = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            const data = new FormData()
            data.append('img_individuo',values.img_individuo)
            data.append('img_img_herbario',values.img_herbario)
            console.log(data);
            let result = null
            if (id) { 
                result = await apiCall(`/estructura/especie/${id}`, data, headers, 'PUT')
            } else {
                result = await apiCall(`/estructura/especie`, data, headers, 'POST')
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

    const handleCancelAddClasificador = () => {
        setOpenDialog(false);
    }
    const handleOkAddClasificador = async () => {
        try {
            dispatch({ type: LOADING_START });
            setOpenDialog(false);
            const result = await apiCall(`/colector`, {nombre:nuevoClasificador}, null, 'POST');
            dispatch({ type: LOADING_END });
            if (result) {
                console.log(result);                
                enqueueSnackbar("Clasificador Creado Correctamente", { variant: 'success' });
                loadClasificadores()
                setObj({
                    ...obj,
                    clasificador:result.data.obj
                })
            }
        } catch (err) {
            dispatch({ type: LOADING_END });
            if (err.response.data.message) {
                enqueueSnackbar(err.response.data.message, { variant: 'error' });
            } else {
                dispatch({ type: SERVER_ERROR, error: err });
                history.push("/error")
            }
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
                <Typography variant="h3" className={classes.header}>Formulario de Especie</Typography>
                <Card>
                    <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    {padres && padres.length > 0 && <Autocomplete
                                        autoComplete
                                        options={padres}
                                        getOptionLabel={option => option.nombre + " - " + option.tipo.label}
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
                                        label="Nombre Científico*"
                                        name="nombre"
                                        id="nombre"
                                        onChange={handleChange}
                                        value={values.nombre || ''}
                                        error={errors.nombre ? true : false}
                                        helperText={errors.nombre}
                                    />
                                    {categorias && categorias.length > 0 && <Autocomplete
                                        autoComplete
                                        options={categorias}
                                        getOptionLabel={option => option.label}
                                        id="categoria_UICN"
                                        name="categoria_UICN"
                                        value={values.categoria_UICN || null}
                                        onChange={(event, newValue) => {
                                            handleSelect("categoria_UICN", newValue)
                                        }}
                                        renderInput={params => (
                                            <TextField {...params} label="Categoría Amenaza UICN*"
                                                className={classes.textField}
                                                error={errors.categoria_UICN ? true : false}
                                                helperText={errors.categoria_UICN} />
                                        )}
                                    />}
                                </Grid>
                                <Grid item xs={6} container> 
                                <Grid container alignItems="flex-end">                                    
                                        {clasificadores && <Autocomplete
                                            autoComplete     
                                            className={classes.autocompleteInline}                                       
                                            options={clasificadores}
                                            getOptionLabel={option => option.nombre}
                                            id="clasificador"
                                            name="clasificador"
                                            value={values.clasificador || null}
                                            onChange={(event, newValue) => {
                                                handleSelect("clasificador", newValue)
                                            }}
                                            onInputChange={(event, value, reason)=>{
                                                if (value!=null&&value!="") {
                                                    setNuevoClasificador(value)                                                
                                                }
                                            }}
                                            renderInput={params => (
                                                <TextField {...params} label="Clasificador"
                                                className={classes.textField}
                                                error={errors.clasificador ? true : false}
                                                helperText={errors.clasificador} />
                                                )}
                                                />}
                                        <AddToPhotos onClick={()=>{
                                            console.log(nuevoClasificador)
                                            setOpenDialog(true);
                                            //salvar y seleccionar
                                        }} />
                                        
                                </Grid>
                                    

                                    <TextField
                                        type="numeric"
                                        className={classes.textField}
                                        label="Año Clasificación"
                                        name="anno_clasificacion"
                                        id="anno_clasificacion"
                                        onChange={handleChange}
                                        value={values.anno_clasificacion || ''}
                                        error={errors.anno_clasificacion ? true : false}
                                        helperText={errors.anno_clasificacion}
                                    />
                                    <TextField
                                        className={classes.textField}
                                        label="Origen"
                                        name="origen"
                                        id="origen"
                                        onChange={handleChange}
                                        value={values.origen || ''}
                                        error={errors.origen ? true : false}
                                        helperText={errors.origen}
                                    />
                                </Grid>
                                <Grid item xs={6}>                                    
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
                                        <Button color="secondary" variant="contained" component="span">
                                            Cargar Imagen Individuo
                                        </Button>
                                        <img id="output_img_individuo" width="300" height="300"></img>
                                    </div>
                                </label>                                                                                                                
                                </Grid>
                                <Grid item xs={6}>                                    
                                <label htmlFor="img_herbario">
                                    <input
                                        style={{ display: 'none' }}
                                        id="img_herbario"
                                        name="img_herbario"
                                        type="file"
                                        onChange={handleFiles}
                                        accept="image/*"
                                    />
                                    <div className={classes.textFieldFile}>
                                        <Button color="secondary" variant="contained" component="span">
                                            Cargar Muestra Hebario
                                        </Button>
                                        <img id="output_img_herbario" width="300" height="300"></img>
                                    </div>
                                </label>                                                                                                                
                                </Grid>
                            </Grid>                            
                        </CardContent>
                        <CardActions className={classes.actions}>
                            {id && <IconButton onClick={resetData} disabled={Loading}><Undo /></IconButton>}
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}>Salvar</Button>
                        </CardActions>
                    </form>
                </Card>
            </div>
            <Dialog title="Adicionar Clasificador" key="dialog"
                body="¿Desea adicionar el Clasificador?"
                open={openDialog}
                handlerOk={handleOkAddClasificador}
                handleCancel={handleCancelAddClasificador} />
        </div>
        

    )
}