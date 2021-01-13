import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Paper,
  FormHelperText,
  FormControlLabel,
  FormControl,
  RadioGroup,
  FormLabel,
  Radio,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Undo from "@material-ui/icons/Undo";
import useStyles from "../../../style";
import useForm from "../../../useForm";
import { useSnackbar } from "notistack";
import { apiCall } from "../../../Redux/Api";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { loading, userAuthenticated } from "../../../Redux/selectors";
import TiposColeccion from "../../../Constant/TiposColeccion";
import { FormattedMessage, useIntl } from "react-intl";

export default ({ match, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const id = match.params.id;
  const [obj, setObj] = useState();
  const [paises, setPaises] = useState([]);
  const [serverErrors, setServerErrors] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const Loading = useSelector((state) => loading(state));
  const userAuth = useSelector((state) => userAuthenticated(state));
  const intl = useIntl();

  let {
    handleChange,
    handleSubmit,
    values,
    errors,
    handleSelect,
    handle2Select,
  } = useForm(
    submit,
    validateForm,
    id ? obj : null,
    serverErrors ? serverErrors : null
  );
  const loadObj = async (id) => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/institucion/${id}`, null, null, "GET");
      setObj(result.data.obj);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  const loadPaises = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/pais/all`, null, null, "GET");
      setPaises(result.data.all);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };

  useEffect(() => {
    loadPaises();
    if (id) {
      loadObj(id);
    }
  }, []);

  function validateForm(values) {
    let errors = {};
    if (!values.nombre) {
      errors.nombre = intl.formatMessage({ id: "institucion.error.nombre" });
    }
    if (!values.pais) {
      errors.pais = intl.formatMessage({ id: "institucion.error.pais" });
    }
    if (!values.tipo_coleccion) {
      errors.tipo_coleccion = intl.formatMessage({
        id: "institucion.error.tipocoleccion",
      });
    }
    if (!values.es_privado) {
      errors.es_privado = intl.formatMessage({
        id: "institucion.error.privado",
      });
    }
    return errors;
  }
  async function submit() {
    try {
      dispatch({ type: LOADING_START });
      let result = null;
      if (id) {
        result = await apiCall(`/institucion/${id}`, values, null, "PUT");
      } else {
        const v = values.institucion
          ? values
          : { ...values, institucion: userAuth.institucion };
        result = await apiCall(`/institucion`, v, null, "POST");
      }
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        history.goBack();
      }
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      if (err.response.data.errors) {
        Object.keys(err.response.data.errors).map((elem) => {
          errors = {
            ...errors,
            [elem]: err.response.data.errors[elem].message,
          };
        });
        setServerErrors(errors);
      } else {
        dispatch({ type: SERVER_ERROR, error: err });
        history.push("/error");
      }
    }
  }

  const resetData = () => {
    loadObj(id);
  };

  return (
    <>
      <div className={classes.header} key="header">
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="page.institucion.form.title" />
        </Typography>
      </div>
      <Paper className={classes.paper} key="paper">
        <form onSubmit={handleSubmit} noValidate>
                    <Grid item container justify="flex-start" spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({id: "institucion.attr.nombre"})+"*"}
                                name="nombre"
                                id="nombre"
                                onChange={handleChange}
                                value={values.nombre || ''}
                                error={errors.nombre ? true : false}
                                helperText={errors.nombre}
                            />
                            {paises && paises.length > 0 && <Autocomplete
                                autoComplete
                                options={paises}
                                // disabled={values.pais}
                                getOptionLabel={option => option.nombre}
                                id="pais"
                                name="pais"
                                value={values.pais || null}
                                onChange={(event, newValue) => {
                                    handleSelect("pais", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label={intl.formatMessage({id: "institucion.attr.pais"})+"*"}
                                        className={classes.textField}
                                        error={errors.pais ? true : false}
                                        helperText={errors.pais} />
                                )}
                            />}
                            {TiposColeccion && <Autocomplete
                                autoComplete
                                options={TiposColeccion}
                                getOptionLabel={option => option}
                                id="tipo_coleccion"
                                name="tipo_coleccion"
                                value={values.tipo_coleccion || null}
                                onChange={(event, newValue) => {
                                    handleSelect("tipo_coleccion", newValue)
                                }}
                                renderInput={params => (
                                    <TextField {...params} label={intl.formatMessage({id: "institucion.attr.tipocoleccion"})+"*"}
                                        className={classes.textField}
                                        error={errors.tipo_coleccion ? true : false}
                                        helperText={errors.tipo_coleccion} />
                                )}
                            />}
                            <FormControl component="fieldset" className={classes.miniTextField}>
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup name="es_privado" value={values.es_privado || 0}
                                            onChange={handleChange} row>
                                            <FormControlLabel
                                                checked={values.es_privado == 1}
                                                value={1}
                                                control={<Radio color="default" />}
                                                label={intl.formatMessage({id: "institucion.attr.privado"})}
                                                labelPlacement="end"
                                            />
                                            <FormControlLabel
                                                checked={values.es_privado == 0}
                                                value={0}
                                                control={<Radio color="default" />}
                                                label={intl.formatMessage({id: "institucion.label.institucional"})}
                                                labelPlacement="end"
                                            />
                                        </RadioGroup>
                                        {errors.es_privado && <FormHelperText error>{errors.es_privado}</FormHelperText>}
                                    </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6"> 
                                <FormattedMessage id="page.institucion.form.label_contacto" />
                            </Typography>
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({id: "institucion.attr.direccion"})}
                                name="direccion"
                                id="direccion"
                                onChange={handleChange}
                                value={values.direccion || ''}
                                error={errors.direccion ? true : false}
                                helperText={errors.direccion}
                            />
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({id: "institucion.attr.telefono"})}
                                name="telefono"
                                id="telefono"
                                onChange={handleChange}
                                value={values.telefono || ''}
                                error={errors.telefono ? true : false}
                                helperText={errors.telefono}
                            />
                            <TextField
                                className={classes.textField}
                                label={intl.formatMessage({id: "institucion.attr.email"})}
                                name="email"
                                id="email"
                                onChange={handleChange}
                                value={values.email || ''}
                                error={errors.email ? true : false}
                                helperText={errors.email}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container justify="flex-start" spacing={3}>
                        <Grid item className={classes.actions}>
                            {id && <IconButton onClick={resetData} disabled={Loading}><Undo /></IconButton>}
                            <Button variant="contained" type="submit" color="primary" disabled={Loading}> <FormattedMessage id="btn.save" />  </Button>
                        </Grid>
                    </Grid>
                </form>
      </Paper>
    </>
  );
};
