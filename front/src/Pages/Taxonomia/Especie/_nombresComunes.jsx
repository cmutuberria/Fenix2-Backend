import React, {  useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography,  Grid,
    Button, IconButton,  Paper, List, ListItem,
    ListItemText,
    ListItemSecondaryAction,
    TextField
} from "@material-ui/core";
import useStyles from '../../../style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Edit, Delete, ExpandMore, ExpandLess } from '@material-ui/icons';
import { loading } from "../../../Redux/selectors";
import { FormattedMessage, useIntl } from "react-intl";


export default ({ obj }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [elements, setElements] = useState(obj.nombres_comunes);
    const [selectedChild, setSelectedChild] = useState();
    const Loading = useSelector(state => loading(state));
    const { enqueueSnackbar } = useSnackbar();
    const [serverErrors, setServerErrors] = useState()
    const [showForm, setShowForm] = useState(false);
    const intl = useIntl();

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = event => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    function validateForm() {
        let errors1 = {};
        if (!values.nombre) {
            errors1.nombre = intl.formatMessage({ id: "especies.error.nombre" })
        }
        setErrors(errors1);
        return errors1;
    }
    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (Object.keys(validateForm()).length === 0) {
                dispatch({ type: LOADING_START })
                let nombres_comunes = elements
                if (selectedChild) {
                    nombres_comunes[nombres_comunes.indexOf(selectedChild)] = values.nombre;
                } else {
                    nombres_comunes.push(values.nombre)
                }
                let result = null
                result = await apiCall(`/estructura/especie/${obj._id}`, { nombres_comunes: nombres_comunes }, null, 'PUT')
                if (result) {
                    enqueueSnackbar(result.data.message, { variant: 'success' })
                    setElements(nombres_comunes)
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

    const handlerDelete = async (item) => {
        try {
            dispatch({ type: LOADING_START })
            let result = null
            const nombres_comunes = elements.filter((elem) => elem != item)
            result = await apiCall(`/estructura/especie/${obj._id}`,
                { nombres_comunes: nombres_comunes }, null, 'PUT')
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' })
                setElements(nombres_comunes)
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
            {elements.map((item, i) => <ListItem key={i}>
                <ListItemText primary={item} />
                <ListItemSecondaryAction >
                    <IconButton aria-label={intl.formatMessage({ id: "btn.edit" })} edge="end"
                        onClick={(e) => {
                            setSelectedChild(item)
                            setValues({ ...values, nombre: item })
                            setShowForm(true)
                        }}>
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label={intl.formatMessage({ id: "btn.delete" })} edge="end"
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
                <Typography variant="h6"><FormattedMessage id="page.especies.detalle.nombres_comunes" /></Typography>
                {!showForm && <Button endIcon={<ExpandMore />}
                    size="small"
                    onClick={()=>setShowForm(!showForm)}>
                    <FormattedMessage id="btn.show" /></Button>}
                {showForm && <Button endIcon={<ExpandLess />}
                    size="small"
                    onClick={()=>setShowForm(!showForm)}>
                    <FormattedMessage id="btn.hide" /></Button>}
            </div>
            {showForm&&<Grid>
                <form onSubmit={handleSubmit} noValidate className={classes.formInline}>
                    <TextField
                        label={intl.formatMessage({ id: "especies.attr.nombre" })+"*"}
                        name="nombre"
                        id="nombre"
                        className={classes.autocompleteInline} 
                        onChange={handleChange}
                        value={values.nombre || ''}
                        error={errors.nombre ? true : false}
                        helperText={errors.nombre}
                    />
                    <Button variant="contained" type="submit"
                        color="primary" size="small" disabled={Loading}><FormattedMessage id="btn.save" /></Button>

                </form>
            </Grid>}
            <Paper variant="outlined">
                {render()}
            </Paper>
        </React.Fragment >
    )
}