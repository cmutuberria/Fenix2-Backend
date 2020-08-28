import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Card, CardContent, Grid,
    Button, IconButton, CardActions, Paper, List, ListItem,
    ListItemText,
    ListItemSecondaryAction,
    TextField
} from "@material-ui/core";
import useStyles from '../../../style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Edit, Delete, AddBox, KeyboardArrowUp, Visibility, Save, ExpandMore, ExpandLess } from '@material-ui/icons';
import { loading } from "../../../Redux/selectors";
import Autocomplete from "@material-ui/lab/Autocomplete";



export default ({ obj, childrens, handleView }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [elements, setElements] = useState(childrens);
    const [selectedChild, setSelectedChild] = useState();
    const Loading = useSelector(state => loading(state));
    const { enqueueSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState()
    const [tipos, setTipos] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (obj) {
            loadTipos()
            setElements(childrens)            
        }
    }, [obj])
    useEffect(() => {
        if (childrens) {
            setElements(childrens)            
        }
    }, [childrens])

    const loadTipos = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/tipoEstructura/Childrens/${obj.tipo._id}`, null, null, 'GET');
            setTipos(result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            //history.push("/error")
        }
    };
    

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
            errors1.tipo = "El tipo es requerido";
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
                const objSubmit = {...values, padre:obj}
                let result = null
                if (selectedChild) {
                    result = await apiCall(`/estructura/${selectedChild._id}`, objSubmit, null, 'PUT')
                } else {
                    result = await apiCall(`/estructura`, objSubmit, null, 'POST')                    
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
        setValues({})
        setErrors({})
        setSelectedChild()
    }
    const loadChildrens = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/Childrens/${obj._id}`, null, null, 'GET');
            setElements(result.data.obj);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            //history.push("/error")
        }
    };

    const handlerDelete = async (item) => {
        try {
            dispatch({ type: LOADING_START })
            let result = null
            result = await apiCall(`/estructura/${item._id}`,null, null, 'DELETE')
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' })
                loadChildrens()
                resetData()
            }
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
        }
    }    
    const render = () => {
        return <List dense>
            {elements.map((item) => <ListItem key={item._id}>
                <ListItemText primary={item.nombre} secondary={item.tipo.label}/>
                <ListItemSecondaryAction >
                    <IconButton aria-label="Detalle" edge="end"
                        onClick={(e) => 
                        // handleView(item)
                        console.log(item)
                        }>
                        <Visibility fontSize="small" />
                    </IconButton>
                     <IconButton aria-label="Editar" edge="end"
                        onClick={(e) => {
                            setSelectedChild(item)
                            setValues(item) 
                            setShowForm(true)                         
                        }}>
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="Eliminar" edge="end"
                        onClick={(e) => {
                            handlerDelete(item)
                        }}>
                        <Delete fontSize="small" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)}
        </List>
    }
    return (
        <React.Fragment>
            <div className={classes.detailHeader}>
                <Typography variant="h6">Hijos</Typography>
                {!showForm && <Button endIcon={<ExpandMore />}
                    size="small"
                    onClick={()=>setShowForm(!showForm)}>
                    Mostrar</Button>}
                {showForm && <Button endIcon={<ExpandLess />}
                    size="small"
                    onClick={()=>setShowForm(!showForm)}>
                    Ocultar</Button>}
            </div>
            {showForm&&<Grid>
                <form onSubmit={handleSubmit} noValidate className={classes.formInline}>
                {tipos && tipos.length > 0 && <Autocomplete                               
                                autoComplete
                                className={classes.autocompleteInline}
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
                                        className={classes.miniTextFieldInline}
                                        error={errors.tipo ? true : false}
                                        helperText={errors.tipo} />
                                )}
                            />}
                            <TextField
                                className={classes.miniTextFieldInline}
                                label="Nombre*"
                                name="nombre"
                                id="nombre"
                                onChange={handleChange}
                                value={values.nombre || ''}
                                error={errors.nombre ? true : false}
                                helperText={errors.nombre}
                            />
                    <Button variant="contained" type="submit"
                        color="primary" size="small" disabled={Loading}>Salvar</Button>

                </form>
            </Grid>}
            <Paper variant="outlined">
                {render()}
            </Paper>
        </React.Fragment >
    )
}