import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import moment from 'moment';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker, KeyboardDatePicker } from '@material-ui/pickers'
import { Button, TextField, Grid,  Checkbox,  } from '@material-ui/core';
import { ExpandMore, ExpandLess, CheckBoxOutlineBlank, CheckBox } from '@material-ui/icons';
import { apiCall } from '../../../Redux/Api';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { tiposArray } from '../../../Constant/TiposEntradasConst'
import { makeStyles } from '@material-ui/core/styles';

const StyleForm = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    header: {
        display: "flex",
        justifyContent: "flex-end",
        margin: theme.spacing(0),
    },
    content: {
        margin: theme.spacing(0),
    },
    actions: {
        margin: theme.spacing(2, 0),
        display: "flex",
        justifyContent: "flex-end",
        '& > *': {
            margin: theme.spacing(0, 1),
        },

    }

}));


export default ({ setFormValues, Loading, history }) => {
    const dispatch = useDispatch();
    const classesForm = StyleForm();
    const [expanded, setExpanded] = useState(true);
    const [paises, setPaises] = useState([])
    const [guiasJb, setGuiasJb] = useState([])
    const [agencias, setAgencias] = useState([])
    const [values, setValues] = useState({});
    const [fieldsOk, setFieldsOk] = useState(0);


    useEffect(() => {
        loadPaises();
        loadAgencias();
        loadGuiasJb();
    }, [])

    useEffect(() => {
       let count = 0  
       Object.keys(values).map((e, k) => {
            if (values[e] && values[e] != [] && values[e] != null && values[e] != "") {
                count++
            }
        })
        setFieldsOk(count)
    }, [values])

    const loadPaises = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/pais/all`, null, null, 'GET');
            setPaises(result.data.all);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const loadGuiasJb = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/guia-jb/all`, null, null, 'GET');
            setGuiasJb(result.data.all);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    const loadAgencias = async () => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/agencia/allguias`, null, null, 'GET');
            setAgencias(result.data.all);
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setValues({
            ...values,
            [name]: value
        });
    };
    const handleSelect = (name, value) => {
        setValues({
            ...values,
            [name]: value
        });
    };
    const validate = () => {
        return ((values.fechaInicio == null || values.fechaInicio.isValid())
            && (values.fechaFin == null || values.fechaFin.isValid())
            && (values.fechaVoucher == null || values.fechaVoucher.isValid()));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let filter = {}
        if (validate()) {
            Object.keys(values).map((e, k) => {
                if (values[e] != [] && values[e] != null && values[e] != "") {
                    let v = values[e]
                    if (e == "fechaVoucher") {
                        v = moment(v).format("YYYY-MM-DD");
                    }
                    if (["tipos", "paises", "agencias", "guiasJb"].includes(e)) {
                        v = v.map((obj)=>obj._id);
                    }
                    filter = {
                        ...filter,
                        [e]: v
                    }
                }

            })
            setFormValues(filter)
        }
    }
    const cleanValues = (e) => {
        e.preventDefault()
        setValues({});
    }
    return (
        <Grid variant='outlined'>
            <Grid className={classesForm.header}>
                {!expanded && <Button endIcon={<ExpandMore />}
                    size="small" color="primary"
                    onClick={handleExpandClick}>
                    Mostrar Filtro</Button>}
                {expanded && <Button endIcon={<ExpandLess />}
                    size="small" color="primary"
                    onClick={handleExpandClick}>
                    Ocultar Filtro</Button>}
            </Grid>

            {expanded && <form onSubmit={handleSubmit} noValidate>
                <MuiPickersUtilsProvider utils={MomentUtils}>

                    <Grid container spacing={2} className={classesForm.content}>
                        <Grid item xs={12} sm={3}>
                            <KeyboardDateTimePicker
                                id="fechaInicio"
                                name="fechaInicio"
                                label="Fecha Inicio"
                                fullWidth
                                showTodayButton
                                value={values.fechaInicio ?
                                    moment(values.fechaInicio).format("YYYY-MM-DDTHH:mm")
                                    : null
                                }
                                onChange={(date) => {
                                    handleSelect("fechaInicio", date)
                                }}
                                format="YYYY-MM-DD hh:mm A"
                                cancelLabel="Cancelar"
                                todayLabel="Hoy"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KeyboardDateTimePicker
                                id="fechaFin"
                                name="fechaFin"
                                label="Fecha Fin"
                                fullWidth
                                showTodayButton
                                value={values.fechaFin ?
                                    moment(values.fechaFin).format("YYYY-MM-DDTHH:mm")
                                    : null}
                                onChange={(date) => {
                                    handleSelect("fechaFin", date)
                                }}
                                format="YYYY-MM-DD hh:mm A"
                                cancelLabel="Cancelar"
                                todayLabel="Hoy"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={tiposArray}
                                getOptionLabel={option => option.label}
                                renderOption={(option, { selected }) => (
                                    <>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                                            checkedIcon={<CheckBox fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.label}
                                    </>
                                )}
                                id="tipos"
                                name="tipos"
                                value={values.tipos || []}
                                onChange={(event, newValue) => {
                                    handleSelect("tipos", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Tipos"
                                        fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Observación"
                                name="observacion"
                                id="observacion"
                                multiline
                                onChange={handleChange}
                                value={values.observacion || ""}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className={classesForm.content}>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={paises}
                                getOptionLabel={option => option.nombre}
                                renderOption={(option, { selected }) => (
                                    <>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                                            checkedIcon={<CheckBox fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.nombre}
                                    </>
                                )}
                                id="paises"
                                name="paises"
                                value={values.paises || []}
                                onChange={(event, newValue) => {
                                    handleSelect("paises", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Paises"
                                        fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={guiasJb}
                                getOptionLabel={option => option.nombre}
                                renderOption={(option, { selected }) => (
                                    <>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                                            checkedIcon={<CheckBox fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.nombre}
                                    </>
                                )}
                                id="guiasJb"
                                name="guiasJb"
                                value={values.guiasJb || []}
                                onChange={(event, newValue) => {
                                    handleSelect("guiasJb", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Guías del Jb"
                                        fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Chapa Auto"
                                name="chapa"
                                id="chapa"
                                onChange={handleChange}
                                value={values.chapa || ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="Ticket"
                                name="ticket"
                                id="ticket"
                                onChange={handleChange}
                                value={values.ticket || ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                fullWidth
                                label="NIP"
                                name="NIP"
                                id="NIP"
                                onChange={handleChange}
                                value={values.NIP || ""}
                            />
                        </Grid>

                    </Grid>
                    <Grid container spacing={2} className={classesForm.content}>
                        <Grid item xs={12} sm={3}>
                            <Autocomplete
                                multiple
                                disableCloseOnSelect
                                options={agencias}
                                getOptionLabel={option => option.nombre}
                                renderOption={(option, { selected }) => (
                                    <>
                                        <Checkbox
                                            icon={<CheckBoxOutlineBlank fontSize="small" />}
                                            checkedIcon={<CheckBox fontSize="small" />}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.nombre}
                                    </>
                                )}
                                id="agencias"
                                name="agencias"
                                value={values.agencias || []}
                                onChange={(event, newValue) => {
                                    handleSelect("agencias", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label="Agencias"
                                        fullWidth />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Nro Voucher"
                                name="nroVoucher"
                                id="nroVoucher"
                                onChange={handleChange}
                                value={values.nroVoucher || ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <KeyboardDatePicker
                                id="fechaVoucher"
                                name="fechaVoucher"
                                label="Fecha Voucher"
                                fullWidth
                                showTodayButton
                                value={values.fechaVoucher ?
                                    moment(values.fechaVoucher).format("YYYY-MM-DD")
                                    : null
                                }
                                onChange={(date) => {
                                    handleSelect("fechaVoucher", date)
                                    //handleSelect("fechaVoucher", moment(date).format("YYYY-MM-DD"))
                                }}
                                format="YYYY-MM-DD"
                                cancelLabel="Cancelar"
                                todayLabel="Hoy"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Empresa"
                                name="empresa"
                                id="empresa"
                                onChange={handleChange}
                                value={values.empresa || ""}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className={classesForm.content}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Persona Autoriza"
                                name="personaAutoriza"
                                id="personaAutoriza"
                                onChange={handleChange}
                                value={values.personaAutoriza || ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Propósito"
                                name="proposito"
                                id="proposito"
                                onChange={handleChange}
                                value={values.proposito || ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        </Grid>
                    </Grid>
                    <Grid container className={classesForm.actions}>
                        <Button size="small" variant="contained" color="primary"
                            disabled={Loading} onClick={cleanValues}>Limpiar</Button>

                        <Button type="submit" size="small" variant="contained" color="primary"
                            disabled={Loading || fieldsOk==0}>Buscar</Button>

                    </Grid>
                </MuiPickersUtilsProvider >

            </form >}
        </Grid>
    )
}