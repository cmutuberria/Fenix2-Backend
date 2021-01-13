import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
  MenuItem,
  Grid,FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText
} from "@material-ui/core";
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
import { loading } from "../../../Redux/selectors";
import { FormattedMessage, useIntl } from "react-intl";

export default ({ match, history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const id = match.params.id;
  const [obj, setObj] = useState({ nombre: "",es_taxon:"0", vista_ampliada:"0"});
  const [padres, setPadres] = useState([]);
  const [hijos, setHijos] = useState([]);
  const [serverErrors, setServerErrors] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const Loading = useSelector((state) => loading(state));
  const intl = useIntl();

  let { handleChange, handleSubmit, values, errors, handle2Select } = useForm(
    submit,
    validateForm,
    obj,
    serverErrors ? serverErrors : null
  );
  const loadObj = async (id) => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/tipoEstructura/${id}`, null, null, "GET");
      const obj1 = result.data.obj;
      setObj({
        ...obj1,
        es_taxon:obj1.es_taxon?"1":"0",
        vista_ampliada:obj1.vista_ampliada?"1":"0"
      })
      handle2Select("padres",obj1.padres, "hijos", obj1.hijos)
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  const getPadres = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/tipoEstructura/All`, null, null, "GET");
      console.log(result);
      const { data } = result;
      setPadres(data);
      setHijos(data);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  useEffect(() => {
    if (id) {
      loadObj(id);
    }
    getPadres();
  }, []);

  function validateForm(values) {
    let errors = {};
    if (!values.nombre) {
      errors.nombre = intl.formatMessage({ id: 'tipoestructura.error.nombre' })
    }
    if (!values.label) {
      errors.label = intl.formatMessage({ id: 'tipoestructura.error.label' })
    }
    if (!values.orden) {
      errors.orden = intl.formatMessage({ id: 'tipoestructura.error.orden' })
    }
    return errors;
  }
  async function submit() {
    try {
      dispatch({ type: LOADING_START });
      let result = null;
      if (id) {
        result = await apiCall(`/tipoEstructura/${id}`, values, null, "PUT");
      } else {
        result = await apiCall(`/tipoEstructura`, values, null, "POST");
      }
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        history.push("/Taxonomia/TipoEstructura");
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
    <div className={classes.rootForm}>
      <div>
        <Typography variant="h3" className={classes.header}>
          <FormattedMessage id="page.tipoestructura.form.title" />  
        </Typography>
        <Card>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent>
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'tipoestructura.attr.nombre' })+"*"}
                name="nombre"
                id="nombre"
                onChange={handleChange}
                value={values.nombre || ""}
                error={errors.nombre ? true : false}
                helperText={errors.nombre}
              />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: 'tipoestructura.attr.label' })+"*"}
                name="label"
                id="label"
                onChange={handleChange}
                value={values.label || ""}
                error={errors.label ? true : false}
                helperText={errors.label}
              />
              <TextField
                className={classes.textField}
                type="number"
                label={intl.formatMessage({ id: 'tipoestructura.attr.orden' })+"*"}
                name="orden"
                id="orden"
                onChange={handleChange}
                value={values.orden || ""}
                error={errors.orden ? true : false}
                helperText={errors.orden}
              />
              <FormControl
                      component="fieldset"
                      className={classes.textField}
                    >
                      <FormLabel component="legend"><FormattedMessage id="tipoestructura.label.es_taxon" /></FormLabel>
                      <RadioGroup
                        row
                        name="es_taxon"
                        value={values.es_taxon || "1"}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={intl.formatMessage({ id: 'tipoestructura.attr.taxon' })}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label={intl.formatMessage({ id: 'tipoestructura.label.estructura' })}
                        />
                      </RadioGroup>
                      <FormHelperText>
                        {errors.es_taxon}
                      </FormHelperText>
                    </FormControl>
                    <FormControl
                      component="fieldset"
                      className={classes.textField}
                    >
                      <FormLabel component="legend"><FormattedMessage id="tipoestructura.attr.vista_ampliada" /></FormLabel>
                      <RadioGroup
                        row
                        name="vista_ampliada"
                        value={values.vista_ampliada || "1"}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={intl.formatMessage({ id: 'si' })}
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label={intl.formatMessage({ id: 'no' })}
                        />
                      </RadioGroup>
                      <FormHelperText>
                        {errors.vista_ampliada}
                      </FormHelperText>
                    </FormControl>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <FormControl className={classes.textField}>
                    <InputLabel id="padres"><FormattedMessage id="tipoestructura.attr.padres" /></InputLabel>
                    <Select
                      labelId="padres"
                      multiple
                      id="padres"
                      name="padres"
                      value={values.padres || []}
                      onChange={handleChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value._id}
                              label={value.nombre}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                    >
                      {padres.map((elem) => (
                        <MenuItem key={elem._id} value={elem}>
                          {elem.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl className={classes.textField}>
                    <InputLabel id="hijos"><FormattedMessage id="tipoestructura.attr.hijos" /></InputLabel>
                    <Select
                      labelId="hijos"
                      multiple
                      id="hijos"
                      name="hijos"
                      value={values.hijos || []}
                      onChange={handleChange}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value._id}
                              label={value.nombre}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                    >
                      {hijos.map((elem) => (
                        <MenuItem key={elem._id} value={elem}>
                          {elem.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions className={classes.actions}>
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
            </CardActions>
          </form>
        </Card>
      </div>
    </div>
  );
};
