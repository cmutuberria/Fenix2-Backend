import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Grid,
    Button, IconButton, Paper, List, ListItem,
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



export default ({ obj }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [elements, setElements] = useState(obj.usos);
    const Loading = useSelector(state => loading(state));
    const { enqueueSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState()
    const [usos, setUsos] = useState();
    const [showForm, setShowForm] = useState(false);
   


    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (obj) {
            loadUsos()
        }
    }, [])

    const loadUsos = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/uso/NotAssigned/${obj._id}`, null, null, 'GET');
            console.log(result.data);
            setUsos(result.data.all);
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
        if (!values.uso) {
            errors1.uso = "El uso es requerido";
        }
        setErrors(errors1);
        return errors1;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (Object.keys(validateForm()).length === 0) {
                dispatch({ type: LOADING_START })
                let usos = elements
                usos.push(values.uso)
                let result = null
                result = await apiCall(`/especie/${obj._id}`, { usos: usos }, null, 'PUT')
                if (result) {
                    enqueueSnackbar(result.data.message, { variant: 'success' })
                    setElements(usos)
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
        loadUsos()
    }


    const handlerDelete = async (item) => {
        try {
            dispatch({ type: LOADING_START })
            let result = null
            const usos = elements.filter((elem) => elem != item)
            result = await apiCall(`/especie/${obj._id}`,
                { usos: usos }, null, 'PUT')
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' })
                setElements(usos)
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
                <ListItemText primary={item.nombre} />
                <ListItemSecondaryAction >
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
                <Typography variant="h6">Usos</Typography>

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
                    {usos && <Autocomplete
                        autoComplete
                        className={classes.autocompleteInline}
                        options={usos}
                        getOptionLabel={option => option.nombre}
                        id="uso"
                        name="uso"
                        value={values.uso || null}
                        onChange={(event, newValue) => {
                            handleChange({ target: { name: "uso", value: newValue } })
                        }}
                        renderInput={params => (
                            <TextField {...params} label="Uso*"
                                className={classes.miniTextFieldInline}
                                error={errors.uso ? true : false}
                                helperText={errors.uso} />
                        )}
                    />}
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