import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  
  Card,
  CardContent,  
  Button,  
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import useForm from "../../../useForm";
import { FormattedMessage, useIntl } from "react-intl";

// import ColectorForm from "../../Configuracion/Colector/_form";

export default ({ openDialog, setOpenDialog, loadClasificadores, handleSelectClasificador, valuesEspecie }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  // const [showForm, setShowForm] = useState(false);

  const [serverErrors, setServerErrors] = useState();
  const intl = useIntl();

  let { resetData, handleChange, handleSubmit, values, errors } = useForm(
    submit,
    validateForm,
    // id ? obj : null,
    null,
    serverErrors ? serverErrors : null
  );
  function validateForm(values) {
    let errors = {};
    if (!values.acronimo) {
      errors.acronimo = intl.formatMessage({ id: "colectores.error.acronimo" })
    }
    return errors;
  }
  async function submit() {
    try {
      dispatch({ type: LOADING_START });
      let result = null;
      result = await apiCall(`/colector`, values, null, "POST");
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        loadClasificadores();
        handleSelectClasificador("clasificadores", valuesEspecie.clasificadores?[...valuesEspecie.clasificadores,result.data.obj]:[result.data.obj])
        setOpenDialog(false);
      }
      dispatch({ type: LOADING_END });
      resetData()

    } catch (err) {
      console.log(err);
      dispatch({ type: LOADING_END });
      if (err.response&&err.response.data.errors) {
        Object.keys(err.response.data.errors).map((elem) => {
          errors = {
            ...errors,
            [elem]: err.response.data.errors[elem].message,
          };
        });
        setServerErrors(errors);
      } else {
        dispatch({ type: SERVER_ERROR, error: err });
      }
    }
  }

  const cancel = () => {
    setOpenDialog(false);
    // loadObj(id);
  };
  return (
    <Dialog
      //   fullWidth={true}
      maxWidth={false}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle id="responsive-dialog-title">
      <FormattedMessage id="page.especies.form.clasificador.dialog.title" />
      
      </DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent className={classes.dialogImg} dividers>
          <Card>
            <CardContent>
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: "colectores.attr.acronimo" })+"*"}
                name="acronimo"
                id="acronimo"
                onChange={handleChange}
                value={values.acronimo || ""}
                error={errors.acronimo ? true : false}
                helperText={errors.acronimo}
              />
              <TextField
                className={classes.textField}
                label={intl.formatMessage({ id: "colectores.attr.nombre" })}
                name="nombre"
                id="nombre"
                onChange={handleChange}
                value={values.nombre || ""}
                error={errors.nombre ? true : false}
                helperText={errors.nombre}
              />
            </CardContent>
          </Card>
        </DialogContent >
        <DialogActions>
          <Button autoFocus onClick={cancel} color="primary">
          <FormattedMessage id="dialog.btn.cancel" />
          </Button>
          <Button type="submit" color="primary">
          <FormattedMessage id="btn.save" />
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
