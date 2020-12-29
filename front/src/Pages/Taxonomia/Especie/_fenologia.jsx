import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  CardActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@material-ui/core";
import useStyles from "../../../style";
import { useSnackbar } from "notistack";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { error, loading } from "../../../Redux/selectors";
import { meses } from "../../../Constant/Meses";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default ({ obj, loadObj }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [serverErrors, setServerErrors] = useState();
  const [showForm, setShowForm] = useState(false);

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (values.f_es_peregnifolia == 1) {
      setValues({
        ...values,
        f_perdida_follage: [],
      });
    }
  }, [values.f_es_peregnifolia]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleSelect = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };
  function validateForm() {
    let errors1 = {};
    if (
      values.f_es_peregnifolia == null ||
      values.f_es_peregnifolia == undefined
    ) {
      errors1.f_es_peregnifolia =
        "Es obligatorio seleccionar el tipo de follage";
    }
    setErrors(errors1);
    return errors1;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (Object.keys(validateForm()).length === 0) {
        dispatch({ type: LOADING_START });        

        let result = null;
        result = await apiCall(
          `/estructura/especie/${obj._id}`,
          values,
          null,
          "PUT"
        );
        if (result) {
          enqueueSnackbar(result.data.message, { variant: "success" });
          resetData();
        }
        dispatch({ type: LOADING_END });
      }
      setShowForm(false);
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
        //history.push("/error")
      }
    }
  }

  const resetData = () => {
    setValues({});
    setErrors({});
    loadObj(obj._id);
  };

  const render = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <List>
            <ListItem key="f_floracion">
              <ListItemText
                primary="Floración:"
                secondary={obj.f_floracion ? obj.f_floracion.join(", ") : ""}
              ></ListItemText>
            </ListItem>
            <ListItem key="f_fructificacion">
              <ListItemText
                primary="Fructificación:"
                secondary={
                  obj.f_fructificacion ? obj.f_fructificacion.join(", ") : ""
                }
              ></ListItemText>
            </ListItem>
            <ListItem key="f_es_peregnifolia">
              <ListItemText
                primary="Tipo Follage:"
                secondary={
                  obj.f_es_peregnifolia ? "Peregnifolia" : "Caducifolia"
                }
              ></ListItemText>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={6}>
          <List>
            <ListItem key="f_hojas_desarrollo">
              <ListItemText
                primary="Hojas Pleno Desarrollo:"
                secondary={
                  obj.f_hojas_desarrollo
                    ? obj.f_hojas_desarrollo.join(", ")
                    : ""
                }
              ></ListItemText>
            </ListItem>
            <ListItem key="f_brotes_florales">
              <ListItemText
                primary="Brotes Florales:"
                secondary={
                  obj.f_brotes_florales ? obj.f_brotes_florales.join(", ") : ""
                }
              ></ListItemText>
            </ListItem>
            {!obj.f_es_peregnifolia && (
              <ListItem key="f_perdida_follage">
                <ListItemText
                  primary="Pérdida Follage:"
                  secondary={
                    obj.f_perdida_follage
                      ? obj.f_perdida_follage.join(", ")
                      : ""
                  }
                ></ListItemText>
              </ListItem>
            )}           
          </List>
        </Grid>
        <Grid item xs={12}>
          <List>
            <ListItem key="f_observaciones">
              <ListItemText
                primary="Observaciones:"
                secondary={<ReactQuill
                  id="f_observacionesShow"
                  name="f_observacionesShow"
                  theme={false}
                  value ={obj.f_observaciones||""}
                  readOnly ={true}
                />}
              ></ListItemText>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    );
  };
  const editData = () => {
    setShowForm(true);
    setValues({
      f_floracion: obj.f_floracion,
      f_fructificacion: obj.f_fructificacion,
      f_es_peregnifolia: obj.f_es_peregnifolia ? "1" : "0",
      f_hojas_desarrollo: obj.f_hojas_desarrollo,
      f_brotes_florales: obj.f_brotes_florales,
      f_perdida_follage: obj.f_perdida_follage,
      f_observaciones: obj.f_observaciones,
    });
  };
  const cancel = () => {
    setShowForm(false);
    setValues({});
  };
  
  return (
    <React.Fragment>
      <Grid container spacing={5}>
        {!showForm&&<Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>{render()}</CardContent>
          </Card>
          <CardActions>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              disabled={Loading}
              onClick={editData}
            >
              Editar
            </Button>
          </CardActions>
        </Grid>}
        {showForm&&<Grid item xs={12}>
          <Card variant="outlined">
            <form onSubmit={handleSubmit} noValidate>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      id="f_floracion"
                      name="f_floracion"
                      className={classes.textField}
                      options={meses}
                      //getOptionLabel={(option) => option.acronimo}
                      value={values.f_floracion || []}
                      onChange={(event, newValue) => {
                        handleSelect("f_floracion", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Floración"
                          className={classes.textField}
                          error={errors.f_floracion ? true : false}
                          helperText={errors.f_floracion}
                        />
                      )}
                    />
                    <Autocomplete
                      multiple
                      id="f_fructificacion"
                      name="f_fructificacion"
                      className={classes.textField}
                      options={meses}
                      //getOptionLabel={(option) => option.acronimo}
                      value={values.f_fructificacion || []}
                      onChange={(event, newValue) => {
                        handleSelect("f_fructificacion", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Fructificación"
                          className={classes.textField}
                          error={errors.f_fructificacion ? true : false}
                          helperText={errors.f_fructificacion}
                        />
                      )}
                    />
                    <FormControl
                      component="fieldset"
                      className={classes.textField}
                    >
                      <FormLabel component="legend">Tipo Follage</FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="f_es_peregnifolia"
                        value={values.f_es_peregnifolia || "1"}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Peregnifolia"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Caducifolia"
                        />
                      </RadioGroup>
                      <FormHelperText>
                        {errors.f_es_peregnifolia}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      id="f_hojas_desarrollo"
                      name="f_hojas_desarrollo"
                      className={classes.textField}
                      options={meses}
                      //getOptionLabel={(option) => option.acronimo}
                      value={values.f_hojas_desarrollo || []}
                      onChange={(event, newValue) => {
                        handleSelect("f_hojas_desarrollo", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Hojas Pleno Desarrollo"
                          className={classes.textField}
                          error={errors.f_hojas_desarrollo ? true : false}
                          helperText={errors.f_hojas_desarrollo}
                        />
                      )}
                    />
                    <Autocomplete
                      multiple
                      id="f_brotes_florales"
                      name="f_brotes_florales"
                      className={classes.textField}
                      options={meses}
                      //getOptionLabel={(option) => option.acronimo}
                      value={values.f_brotes_florales || []}
                      onChange={(event, newValue) => {
                        handleSelect("f_brotes_florales", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Brotes Frolares"
                          className={classes.textField}
                          error={errors.f_brotes_florales ? true : false}
                          helperText={errors.f_brotes_florales}
                        />
                      )}
                    />
                    {values.f_es_peregnifolia == 0 && (
                      <Autocomplete
                        multiple
                        id="f_perdida_follage"
                        name="f_perdida_follage"
                        className={classes.textField}
                        options={meses}
                        //getOptionLabel={(option) => option.acronimo}
                        value={values.f_perdida_follage || []}
                        onChange={(event, newValue) => {
                          handleSelect("f_perdida_follage", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pérdida Follage"
                            className={classes.textField}
                            error={errors.f_perdida_follage ? true : false}
                            helperText={errors.f_perdida_follage}
                          />
                        )}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                  <ReactQuill
                      theme={"snow"}
                      id="f_observaciones"
                      name="f_observaciones"
                      onChange={(value)=>handleSelect("f_observaciones", value)}
                      value={values.f_observaciones || ""}
                    />
                    {/* <TextField
                      id="f_observaciones"
                      name="f_observaciones"
                      label="Observaciones"
                      multiline
                      rows={4}
                      className={classes.textField}
                      onChange={handleChange}
                      value={values.f_observaciones || ""}
                      error={errors.f_observaciones ? true : false}
                      helperText={errors.f_observaciones}
                    /> */}
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions className={classes.spaceBetween}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled={Loading}
                >
                  Salvar
                </Button>
                <Button variant="contained" color="primary" disabled={Loading} onClick={cancel}>Cancelar</Button>

              </CardActions>
            </form>
          </Card>
        </Grid>}
      </Grid>
    </React.Fragment>
  );
};
