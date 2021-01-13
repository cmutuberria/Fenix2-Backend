import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  List,
  ListItem,
  ListItemText,
  TextField,
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FormattedMessage } from "react-intl";

export default ({ obj, loadObj }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [showForm, setShowForm] = useState(false);


  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState();

  const handleChange = (value) => {
    setValues({
      habitat: value,
    });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    try {
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
      <Grid container>
        <Grid item xs={12}>
          <ReactQuill
            id="show"
            name="show"
            theme={false}
            value ={obj.habitat||""}
            readOnly ={true}
          />
        </Grid>
      </Grid>
    );
  };
  const editData = () => {
    setShowForm(true);  
    setValues({
      habitat: obj.habitat,
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
              <FormattedMessage id="btn.edit" />
            </Button>
          </CardActions>
        </Grid>}
        {showForm&&<Grid item xs={12}>
          <Card variant="outlined">
            <form onSubmit={handleSubmit} noValidate>
              <CardContent>
                <Grid container>
                  <Grid item xs={12}>
                    <ReactQuill
                      theme={"snow"}
                      id="habitat"
                      name="habitat"
                      onChange={handleChange}
                      value={values.habitat || ""}
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
        </Grid>}
      </Grid>
    </React.Fragment>
  );
};
