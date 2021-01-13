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
  Checkbox,
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
import { rolesArray, rolesArrayOrigin } from "../../../Constant/Roles";
import { CheckBoxOutlineBlank, CheckBox } from "@material-ui/icons";
import { FormattedMessage, useIntl } from "react-intl";

export default ({ match, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const id = match.params.id;
  const [obj, setObj] = useState();
  const [jardines, setJardines] = useState([]);
  const [serverErrors, setServerErrors] = useState();
  const [isUnique, setIsUnique] = useState();
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
      const result = await apiCall(`/trabajador/${id}`, null, null, "GET");
      setObj(result.data.obj);
      if (isUnique) {
        setIsUnique({ ...isUnique, unique: true });
      }
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  const loadJardines = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/institucion/all`, null, null, "GET");
      console.log(result);
      setJardines(result.data.all);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };

  useEffect(() => {
    loadJardines();
    if (id) {
      loadObj(id);
    }
  }, []);
  const handleChangeUnique = async (e) => {
    try {
      handleChange(e);
      dispatch({ type: LOADING_START });
      let query = `field=${e.target.name}&value=${e.target.value}`;
      if (id) {
        query += `&_id=${id}`;
      }
      const result = await apiCall(
        `/trabajador/unique?${query}`,
        null,
        null,
        "GET"
      );
      setIsUnique(result.data);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  useEffect(() => {
    if (isUnique) {
      if (!isUnique.unique) {
        errors[isUnique.field] = intl.formatMessage({ id: "trabajadores.error.unique" });
      } else {
        errors[isUnique.field] = null;
      }
    }
  }, [isUnique]);

  function validateForm(values) {
    let errors = {};
    if (!values.nombre) {
      errors.nombre = intl.formatMessage({ id: "trabajadores.error.nombre" });
    }
    if (!values.nro_identificacion) {
      errors.nro_identificacion = intl.formatMessage({ id: "trabajadores.error.nro_identificacion" });
    }
    if (userAuth.usuario_general && !values.usuario_general && !values.jardin) {
      errors.jardin =intl.formatMessage({ id: "trabajadores.error.institucion" });
    }
    if (isUnique) {
      if (!isUnique.unique) {
        errors[isUnique.field] = intl.formatMessage({ id: "trabajadores.error.unique" });
      }
    }
    return errors;
  }
  async function submit() {
    try {
      dispatch({ type: LOADING_START });
      let result = null;
      if (id) {
        result = await apiCall(`/trabajador/${id}`, values, null, "PUT");
      } else {
        const v = values.jardin
          ? values
          : { ...values, jardin: userAuth.jardin };
        result = await apiCall(`/trabajador`, v, null, "POST");
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
          <FormattedMessage id="page.trabajadores.form.title" />
        </Typography>
      </div>
      <Paper className={classes.paper} key="paper">
        <form onSubmit={handleSubmit} noValidate>
          <Grid item container justify="flex-start" spacing={3}>
            <Grid item xs={4}>
              {userAuth.usuario_general && [
                <React.Fragment key={0}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 2 }}
                    checked={
                      values.usuario_general ? values.usuario_general : false
                    }
                    value={
                      values.usuario_general ? values.usuario_general : false
                    }
                    id="usuario_general"
                    name="usuario_general"
                    onChange={() => {
                      if (!values.usuario_general) {
                        handle2Select(
                          "usuario_general",
                          !values.usuario_general,
                          "jardin",
                          null
                        );
                      } else {
                        handleChange({
                          target: {
                            name: "usuario_general",
                            value: !values.usuario_general,
                          },
                        });
                      }
                    }}
                  />
                  <FormattedMessage id="trabajadores.label.general" />
                </React.Fragment>,
                jardines && jardines.length > 0 && (
                  <Autocomplete
                    key={2}
                    autoComplete
                    options={jardines}
                    disabled={values.usuario_general}
                    getOptionLabel={(option) => option.nombre}
                    id="jardin"
                    name="jardin"
                    value={values.jardin || null}
                    onChange={(event, newValue) => {
                      handleSelect("jardin", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={intl.formatMessage({ id: 'trabajadores.attr.institucion' })}
                        className={classes.textField}
                        error={errors.jardin ? true : false}
                        helperText={errors.jardin}
                      />
                    )}
                  />
                ),
              ]}
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.nombre' })+"*"}
                name="nombre"
                id="nombre"
                onChange={handleChange}
                value={values.nombre || ""}
                error={errors.nombre ? true : false}
                helperText={errors.nombre}
              />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.apellidos' })}
                name="apellidos"
                id="apellidos"
                onChange={handleChange}
                value={values.apellidos || ""}
                error={errors.apellidos ? true : false}
                helperText={errors.apellidos}
              />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.nro_identificacion' })+"*"}
                name="nro_identificacion"
                id="nro_identificacion"
                type="number"
                onChange={handleChangeUnique}
                value={values.nro_identificacion || ""}
                error={errors.nro_identificacion ? true : false}
                helperText={errors.nro_identificacion}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6"><FormattedMessage id="page.trabajadores.form.label_contacto" /></Typography>
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.direccion' })}
                name="direccion"
                id="direccion"
                onChange={handleChange}
                value={values.direccion || ""}
                error={errors.direccion ? true : false}
                helperText={errors.direccion}
                />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.telefono' })}
                name="telefono"
                id="telefono"
                onChange={handleChange}
                value={values.telefono || ""}
                error={errors.telefono ? true : false}
                helperText={errors.telefono}
                />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.email' })}
                name="email"
                id="email"
                onChange={handleChange}
                value={values.email || ""}
                error={errors.email ? true : false}
                helperText={errors.email}
                />
            </Grid>
            <Grid item xs={4}>
            <Typography variant="h6"><FormattedMessage id="page.trabajadores.form.label_user" /></Typography>
              <FormHelperText>
              <FormattedMessage id="page.trabajadores.form.label_user_subtitle" />
              </FormHelperText>
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'trabajadores.attr.usuario' })}
                // label="Usuario"
                name="usuario"
                id="usuario"
                onChange={handleChangeUnique}
                value={values.usuario || ""}
                error={errors.usuario ? true : false}
                helperText={errors.usuario}
              />
              {rolesArray && (
                <Autocomplete
                  autoComplete
                  multiple
                  disableCloseOnSelect
                  options={rolesArrayOrigin}
                  getOptionLabel={(option) => option}
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox fontSize="small" />}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </>
                  )}
                  id="roles"
                  name="roles"
                  value={values.roles || []}
                  onChange={(event, newValue) => {
                    handleSelect("roles", newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={intl.formatMessage({ id: 'trabajadores.attr.roles' })}
                      className={classes.textField}
                      error={errors.roles ? true : false}
                      helperText={errors.roles}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>
          <Grid item container justify="flex-start" spacing={3}>
            <Grid item className={classes.actions}>
              {id && (
                <IconButton onClick={resetData} disabled={Loading}>
                  <Undo />
                </IconButton>
              )}
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={Loading}
              >
                <FormattedMessage id="btn.save" />                
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
};
