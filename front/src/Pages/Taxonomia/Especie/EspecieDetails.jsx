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
  AppBar,
  Tabs,
  Tab,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import useStyles from "../../../style";
import { useSnackbar } from "notistack";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import {
  Visibility,
  Edit,
  GetApp
} from "@material-ui/icons";
import { loading } from "../../../Redux/selectors";
import CategoriaUICN from "../../../Constant/CategoriaUICN";
import Sinonimias from "./_sinonimias";
import NombresComunes from "./_nombresComunes";
import Fenologia from "./_fenologia";
import Habitat from "./_habitat";
import Childrens from "./_childrens";
import Usos from "./_usos";
import TabPanel from "../../../Components/TabPanel";
import DialogImg from "../../../Components/DialogImg";
import showClasificadores from "../../../Utils/showClasificadores";
import Amenazas from "./_amenazas";
import Galeria from "./_galeria";
import Referencias from './_referencias';
import { FormattedMessage, useIntl } from "react-intl";


export default ({ history, match }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const id = match.params.id;
  const [obj, setObj] = useState();
  const [parents, setParents] = useState([]);
  const [childrens, setChildrens] = useState();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [imgPath, setImgPath] = useState("false");
  const intl = useIntl();


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id) {
      loadObj(id);
    }
  }, [id]);

  const loadObj = async (id) => {
    try {
      const estructura = await apiCall(
        `/estructura/OneWithParentsAndChildrens/${id}`,
        null,
        null,
        "GET"
      );
      setObj(estructura.data.obj);
      setParents(estructura.data.parents);
      setChildrens(estructura.data.childrens);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };

  const handleDelete = async (obj) => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(
        `/estructura/${obj._id}`,
        null,
        null,
        "DELETE"
      );
      dispatch({ type: LOADING_END });
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        history.goBack();
      }
    } catch (err) {
      dispatch({ type: LOADING_END });
      if (err.response.data.message) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        dispatch({ type: SERVER_ERROR, error: err });
        history.push("/error");
      }
    }
  };
  const renderParents = () => {
    return (
      <List dense>
        {parents.map((obj) => (
          <ListItem key={obj._id}>
            <ListItemText primary={obj.nombre} secondary={obj.tipo.label} />
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Detalle"
                edge="end"
                onClick={(e) => handleView(obj)}
              >
                <Visibility fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  };

  const handleView = (obj) => {
    history.push(`/Taxonomia/Estructura/Detalle/${obj._id}`);
  };
  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };
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
      history.push("/error");
    }
  };

  const handlerImgFullWith = (e) => {
    setImgPath(e.target.src);
    setOpen(true);
  };
  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="page.especies.detalle.title"values={{obj:obj?obj.tipo.label:""}} />
        </Typography>
      </div>

      <Card className={classes.card}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Detalles"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.informacion_general" })} {...a11yProps(0)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.nomenclatura" })} {...a11yProps(1)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.fenologia" })} {...a11yProps(2)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.habitat" })} {...a11yProps(3)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.amenazas" })} {...a11yProps(4)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.galeria" })} {...a11yProps(5)} />
            <Tab label={intl.formatMessage({ id: "page.especies.detalle.tab.referencias" })} {...a11yProps(6)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <CardContent>
            {obj && (
              <Grid container spacing={5}>
                <Grid container item xs={4} spacing={2}>
                  <Grid item xs={10}>
                    <Card>
                      {obj.img_individuo && (
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt={intl.formatMessage({ id: "page.especies.detalle.imagen_representativa" })}
                            height="300"
                            image={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${obj.img_individuo}`}
                            title={intl.formatMessage({ id: "page.especies.detalle.imagen_representativa" })}
                            onClick={handlerImgFullWith}
                          />
                          <div className={classes.iconsBetween}>
                            <IconButton
                              aria-label={intl.formatMessage({ id: "btn.edit" })}
                              onClick={() =>
                                history.push(
                                  `/Taxonomia/Especie/ImgRepresentativa/${obj._id}`
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              aria-label={intl.formatMessage({ id: "btn.download" })}
                              onClick={() => download(obj.img_individuo)}
                            >
                              <GetApp />
                            </IconButton>
                          </div>
                        </CardActionArea>
                      )}
                      {!obj.img_individuo && (
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() =>
                              history.push(
                                `/Taxonomia/Especie/ImgRepresentativa/${obj._id}`
                              )
                            }
                          >
                          <FormattedMessage id="page.especies.detalle.imagen_representativa"/>
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                  <Grid item xs={10}>
                    <Card>
                      {obj.img_herbario && (
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            alt={intl.formatMessage({ id: "page.especies.detalle.muestra_representativa" })}
                            height="300"
                            image={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${obj.img_herbario}`}
                            title={intl.formatMessage({ id: "page.especies.detalle.muestra_representativa" })}
                            onClick={handlerImgFullWith}
                          />
                          <div className={classes.iconsBetween}>
                            <IconButton
                              aria-label={intl.formatMessage({ id: "btn.edit" })}
                              onClick={() =>
                                history.push(
                                  `/Taxonomia/Especie/MuestraHerbario/${obj._id}`
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                            {/* <a href={`${process.env.REACT_APP_BASE_URL}/utils/img?path=${obj.img_herbario}`} download> */}
                            <IconButton
                              aria-label={intl.formatMessage({ id: "btn.download" })}
                              onClick={() => download(obj.img_herbario)}
                            >
                              <GetApp />
                            </IconButton>
                            {/* </a> */}
                          </div>
                        </CardActionArea>
                      )}
                      {!obj.img_herbario && (
                        <CardActions>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() =>
                              history.push(
                                `/Taxonomia/Especie/MuestraHerbario/${obj._id}`
                              )
                            }
                          >
                          <FormattedMessage id="page.especies.detalle.muestra_representativa"/>
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                </Grid>
                <Grid container item xs={8} spacing={5}>
                  <Grid item container xs={12}>
                    <Card className={classes.cardFullWidth}>
                      <CardContent>
                        <Grid container spacing={5} className={classes.detail}>
                          <Grid item lg={6}>
                            <List>
                              <ListItem divider key={obj._id}>
                                <ListItemText
                                  primary={
                                    <Typography variant="h5">
                                      {obj.nombre}
                                    </Typography>
                                  }
                                  secondary={obj.tipo.label}
                                ></ListItemText>
                              </ListItem>
                              <ListItem key="categoria_UICN">
                                <ListItemText
                                  primary={
                                    CategoriaUICN.find(
                                      (elem) => elem._id == obj.categoria_UICN
                                    ).label
                                  }
                                  secondary={intl.formatMessage({ id: "especies.label.categoria_UICN" })}
                                ></ListItemText>
                              </ListItem>

                              <ListItem key="clasificadores">
                                <ListItemText
                                  primary={showClasificadores(
                                    obj.clasificadores
                                  )}
                                  secondary={intl.formatMessage({ id: "especies.attr.clasificador" })}
                                ></ListItemText>
                              </ListItem>
                              <ListItem key="anno_clasificacion">
                                <ListItemText
                                  primary={obj.anno_clasificacion}
                                  secondary={intl.formatMessage({ id: "especies.attr.anno_clasificacion" })}
                                ></ListItemText>
                              </ListItem>
                              <ListItem key="origen">
                                <ListItemText
                                  primary={obj.origen}
                                  secondary={intl.formatMessage({ id: "especies.attr.origen" })}
                                ></ListItemText>
                              </ListItem>
                            </List>
                          </Grid>
                          <Grid item lg={6}>
                            <div className={classes.detailHeader}>
                              <Typography variant="h6">
                              <FormattedMessage id="page.especies.detalle.clasificacion"/>
                              </Typography>
                            </div>
                            <Paper variant="outlined">{renderParents()}</Paper>
                          </Grid>
                        </Grid>
                      </CardContent>
                      {obj && obj._id && (
                        <CardActions className={classes.detailActionsRight}>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={Loading}
                            onClick={() =>
                              history.push(
                                `/Taxonomia/Especie/Formulario/${obj._id}`
                              )
                            }
                          >
                            <FormattedMessage id="btn.edit"/>
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={Loading}
                            onClick={(e) => handleDelete(obj)}
                          >
                            <FormattedMessage id="btn.delete"/>
                          </Button>
                        </CardActions>
                      )}
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card className={classes.cardFullWidth}>
                      <CardContent>
                        <Usos obj={obj} />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CardContent>
            {obj && (
              <Grid container spacing={3}>
                {
                  <Grid item xs={6}>
                    <Sinonimias obj={obj} />
                  </Grid>
                }
                {
                  <Grid item xs={6}>
                    <NombresComunes obj={obj} />
                  </Grid>
                }
                {/* {childrens && <Grid item xs={6}>
                                <Childrens obj={obj} childrens={childrens} handleView={handleView} />
                            </Grid>} */}
              </Grid>
            )}
          </CardContent>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {obj && <Fenologia obj={obj} loadObj={loadObj} />}
        </TabPanel>
        <TabPanel value={value} index={3}>
          {obj && <Habitat obj={obj} loadObj={loadObj} />}
        </TabPanel>
        <TabPanel value={value} index={4}>
          {obj && <Amenazas obj={obj} loadObj={loadObj} />}
        </TabPanel>
        <TabPanel value={value} index={5}>
          {obj && <Galeria obj={obj} loadObj={loadObj} />}
        </TabPanel>
        <TabPanel value={value} index={6}>
          <CardContent>
            {obj && (
              <Grid container>                
                  <Grid item xs={12}>
                    <Referencias obj={obj} />
                  </Grid>                
              </Grid>
            )}
          </CardContent>
        </TabPanel>
      </Card>
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
