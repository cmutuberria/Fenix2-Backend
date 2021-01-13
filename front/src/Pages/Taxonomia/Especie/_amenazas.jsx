import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemText,
  TextField
} from "@material-ui/core";
import useStyles from "../../../style";
import { useSnackbar } from "notistack";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { loading } from "../../../Redux/selectors";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FormattedMessage, useIntl } from "react-intl";


export default ({ obj, loadObj }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [serverErrors, setServerErrors] = useState();
  const [showForm, setShowForm] = useState(false);

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [amenazas, setAmenazas] = useState([]);
  const [estreses, setEstreses] = useState([]);
  const intl = useIntl();

  const loadAmenazas = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/amenaza/all-amenazas`, null, null, "GET");
      setAmenazas(result.data.all);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
    }
  };
  const loadEstreses = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/amenaza/all-estreses`, null, null, "GET");
      setEstreses(result.data.all);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
    }
  };
  useEffect(() => {
    loadAmenazas();
    loadEstreses();
  }, []);

  const handleSelect = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };
  function validateForm() {
    let errors1 = {};
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
      <Grid container spacing={5}>
        <Grid item xs={6}>
              {/* <Typography variant="h6">Amenazas:</Typography> */}
          <List>
            {obj.a_amenazas.map((elem) => (
              
              <ListItem >
                <ListItemText key={elem._id} 
                primary={elem.nombre}
                secondary={elem.tipo?intl.formatMessage({ id: "especies.label.amenaza" }):intl.formatMessage({ id: "especies.label.estres" })}/>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={6}>
        {/* <Typography variant="h6">Estreses:</Typography> */}
          <List>
            {obj.a_estreses.map((elem) => (
              <ListItem >
                <ListItemText key={elem._id} primary={elem.nombre} 
                secondary={elem.tipo?intl.formatMessage({ id: "especies.label.amenaza" }):intl.formatMessage({ id: "especies.label.estres" })}></ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12}>
          <List>
            <ListItem key="a_observaciones">
              <ListItemText
                primary={intl.formatMessage({ id: "especies.attr.f_observaciones" })+":"}
                secondary={
                  <ReactQuill
                    id="a_observacionesShow"
                    name="a_observacionesShow"
                    theme={false}
                    value={obj.a_observaciones || ""}
                    readOnly={true}
                  />
                }
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
      a_amenazas:obj.a_amenazas,
      a_estreses:obj.a_estreses,
      a_observaciones:obj.a_observaciones
    });
  };
  const cancel = () => {
    setShowForm(false);
    setValues({});
  };
  return (
    <React.Fragment>
      <Grid container spacing={5}>
        {!showForm && (
          <Grid item xs={12}>
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
               <FormattedMessage id="btn.edit" />
              </Button>
            </CardActions>
          </Grid>
        )}
        {showForm && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <form onSubmit={handleSubmit} noValidate>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      id="a_amenazas"
                      name="a_amenazas"
                      className={classes.textField}
                      options={amenazas}
                      getOptionLabel={(option) => option.nombre}
                      value={values.a_amenazas || []}
                      onChange={(event, newValue) => {
                        handleSelect("a_amenazas", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={intl.formatMessage({ id: "especies.label.amenazas" })}
                          className={classes.textField}
                          error={errors.a_amenazas ? true : false}
                          helperText={errors.a_amenazas}
                        />
                      )}
                    />
                    </Grid>
                    <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      id="a_estreses"
                      name="a_estreses"
                      className={classes.textField}
                      options={estreses}
                      getOptionLabel={(option) => option.nombre}
                      value={values.a_estreses || []}
                      onChange={(event, newValue) => {
                        handleSelect("a_estreses", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={intl.formatMessage({ id: "especies.label.estreses" })}
                          className={classes.textField}
                          error={errors.a_estreses ? true : false}
                          helperText={errors.a_estreses}
                        />
                      )}
                    />


                    </Grid>
                    <Grid item xs={12}>
                      <ReactQuill
                        theme={"snow"}
                        id="a_observaciones"
                        name="a_observaciones"
                        onChange={(value) =>
                          handleSelect("a_observaciones", value)
                        }
                        value={values.a_observaciones || ""}
                      />
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
                  <FormattedMessage id="btn.save" />
                </Button>
                <Button variant="contained" color="primary" disabled={Loading} onClick={cancel}><FormattedMessage id="btn.cancel" /></Button>

              </CardActions>
              </form>
            </Card>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};
