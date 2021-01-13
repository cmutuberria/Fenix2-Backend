import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  Button,
  CardActions,
  CardHeader,
  Typography,
  FormHelperText,
  IconButton, 
  CardActionArea, 
  CardMedia
} from "@material-ui/core";
import useStyles from "../../../style";
import { useSnackbar } from "notistack";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Delete, GetApp } from "@material-ui/icons";
import { loading } from "../../../Redux/selectors";
import DialogImg from "../../../Components/DialogImg";
import { FormattedMessage, useIntl } from "react-intl";


export default ({ obj, loadObj }) => {
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [showForm, setShowForm] = useState(false);
  const classes = useStyles();

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const intl = useIntl();

  
  const [open, setOpen] = useState(false);
  const [imgPath, setImgPath] = useState("false");

  const handleSelect = (name, value) => {
    setValues({
      [name]: value,
    });
  };

  function validateForm(values) {
    let errors = {};
    if (!values.imagen) {
      errors.imagen = intl.formatMessage({ id: "especies.error.imagen" })
    }
    return errors;
  }
  async function submit(event) {
    event.preventDefault();
    try {
      dispatch({ type: LOADING_START });
      const headers = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const data = new FormData();
      data.append("_id", obj._id);
      data.append("imagen", values.imagen);
      let result = null;
      result = await apiCall(
        `/estructura/add-imagen-galeria`,
        data,
        headers,
        "POST"
      );
      dispatch({ type: LOADING_END });
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        resetData();
      }
    } catch (err) {
      dispatch({ type: LOADING_END });
    }
  }

  const resetData = () => {
    setShowForm(false);
    setValues({});
    setErrors({});
    loadObj(obj._id);
  };

  const handleFiles = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    handleSelect(name, file);
    if (file != null) {
      var reader = new FileReader();
      reader.onload = function () {
        var output = document.getElementById("output_" + name);
        output.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };  
/***/
const download = async (path) => {
  try {
    dispatch({ type: LOADING_START });
    const result = await apiCall(
      `/utils/img?path=${path}`,
      null,
      null,
      "GET",
      "blob"
    );
    const url = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      Date.now() + path.substring(path.indexOf("."))
    );
    document.body.appendChild(link);
    link.click();
    dispatch({ type: LOADING_END });
  } catch (err) {
    dispatch({ type: LOADING_END });
    dispatch({ type: SERVER_ERROR, error: err });
  }
};
const handelDelete = async (path) => {
  try {
    dispatch({ type: LOADING_START });
    const result = await apiCall(`/estructura/delete-imagen-galeria`,
          {_id:obj._id,
            path:path},
            null,
            "POST"
    );    
    dispatch({ type: LOADING_END });if (result) {
      enqueueSnackbar(result.data.message, { variant: "success" });
      resetData();
    }
  } catch (err) {
    dispatch({ type: LOADING_END });
  }
};
  const handlerImgFullWith = (e) => {
    setImgPath(e.target.src);
    setOpen(true);
  };
  const render = () => {
    return (
      <div className={classes.root}>
        {/* <GridList cols={4} className={classes.gridList}>
        {obj.galeria.map((img) => (
          <GridListTile key={img}>
            <img src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${img}`} alt={img} />
            <GridListTileBar              
              actionIcon={
                <IconButton>
                  <Delete />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList> */}
      <Grid container spacing={2,1}>

        {obj.galeria.map((img) => (
          <Grid item xs={3}>
          <Card>
            <CardActionArea>
              <CardMedia
                component="img"
                alt={intl.formatMessage({ id: "especies.label.imagen" })}
                height="300"
                image={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${img}`}
                onClick={handlerImgFullWith}
              />
              <div className={classes.iconsBetween}>
                <IconButton
                  onClick={() => handelDelete(img)}
                >
                  <Delete />
                </IconButton>
                <IconButton
                  onClick={() => download(img)}
                >
                  <GetApp />
                </IconButton>
              </div>
            </CardActionArea>                     
          </Card>
      </Grid>
        ))}
      </Grid>
      </div>
    );
  };
  const editData = () => {
    setShowForm(true);
  };
  const cancel = () => {
    setShowForm(false);
    setValues({});
  };
  return (
    <React.Fragment>
      {!showForm && (
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardHeader
                action={
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    size="small"
                    disabled={Loading}
                    onClick={editData}
                  >
                  <FormattedMessage id="page.especies.detalle.adicionar_imagen" />
                  </Button>
                }
                // title="Shrimp and Chorizo Paella"
                // subheader="September 14, 2016"
              />
              <CardContent>{render()}</CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {showForm && (
        <div className={classes.rootForm}>
          <div>
            {/* <GaleriaForm obj={obj} loadObj={loadObj} /> */}
            <Typography variant="h3" className={classes.header}>
            <FormattedMessage id="page.especies.detalle.adicionar_imagen_a_galeria" />
            </Typography>
            <Card className={classes.card}>
              <form onSubmit={submit} noValidate encType="multipart/form-data">
                <CardContent>
                  <label htmlFor="imagen">
                    <input
                      style={{ display: "none" }}
                      id="imagen"
                      name="imagen"
                      type="file"
                      onChange={handleFiles}
                      accept="image/*"
                    />
                    <div className={classes.textFieldFile}>
                      <Button color="primary" component="span">
                        <FormattedMessage id="page.especies.detalle.cargar_imagen" />
                      </Button>
                      {errors.imagen && (
                        <FormHelperText error>{errors.imagen}</FormHelperText>
                      )}
                      <img id="output_imagen" width="350" height="350"></img>
                    </div>
                  </label>
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
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={Loading}
                    onClick={cancel}
                  >
                    <FormattedMessage id="btn.cancel" />
                  </Button>
                </CardActions>
              </form>
            </Card>
          </div>
        </div>
      )}
      {obj && (
        <DialogImg
          imgPath={imgPath}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </React.Fragment>
  );
};
