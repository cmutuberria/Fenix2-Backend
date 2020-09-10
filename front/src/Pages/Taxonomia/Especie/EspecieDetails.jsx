import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Card, CardContent, Grid,
    Button, IconButton, CardActions, Paper, List, ListItem,
    ListItemText,
    ListItemSecondaryAction,
    AppBar,
    Tabs,
    Tab,
    CardMedia,
    Avatar,
    GridList,
    GridListTile,
    GridListTileBar
} from "@material-ui/core";
import useStyles from '../../../style'
import listStyle from './style'
import { useSnackbar } from 'notistack';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Visibility, StarBorder, Edit, Delete, GetApp, GetAppOutlined, EditOutlined, DeleteOutlined } from '@material-ui/icons';
import { loading } from "../../../Redux/selectors";
import CategoriaUICN from '../../../Constant/CategoriaUICN';
import Sinonimias from "./_sinonimias";
import NombresComunes from "./_nombresComunes";
import Childrens from "./_childrens";
import Usos from "./_usos";
import TabPanel from '../../../Components/TabPanel';



export default ({ history, match }) => {
    const classes = useStyles();
    const classesList = listStyle();
    const dispatch = useDispatch();
    const id = match.params.id;
    const [obj, setObj] = useState();
    const [parents, setParents] = useState([]);
    const [childrens, setChildrens] = useState();
    const Loading = useSelector(state => loading(state));
    const { enqueueSnackbar } = useSnackbar();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => {
        if (id) {
            loadObj(id);
        }
    }, [id])


    const loadObj = async (id) => {
        try {
            dispatch({ type: LOADING_START });
            // const result = await apiCall(`/estructura/${id}`, null, null, 'GET');
            // const especie = result.data.obj
            // setObj(especie)
            // const estructura = await apiCall(`/estructura/OneWithParentsAndChildrens/${especie._id}`, null, null, 'GET');
            const estructura = await apiCall(`/estructura/OneWithParentsAndChildrens/${id}`, null, null, 'GET');
            setObj(estructura.data.obj)
            setParents(estructura.data.parents)
            setChildrens(estructura.data.childrens)
            dispatch({ type: LOADING_END });
        } catch (err) {
            console.log(err);

            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };

    const handleDelete = async (obj) => {
        try {
            dispatch({ type: LOADING_START });
            const result = await apiCall(`/estructura/${obj._id}`, null, null, 'DELETE');
            dispatch({ type: LOADING_END });
            if (result) {
                enqueueSnackbar(result.data.message, { variant: 'success' });
                history.goBack()
            }
        } catch (err) {
            dispatch({ type: LOADING_END });
            if (err.response.data.message) {
                enqueueSnackbar(err.response.data.message, { variant: 'error' });
            } else {
                dispatch({ type: SERVER_ERROR, error: err });
                history.push("/error")
            }
        }
    }
    const renderParents = () => {
        return <List dense>
            {parents.map((obj) => <ListItem key={obj._id} >
                <ListItemText primary={obj.nombre} secondary={obj.tipo.label} />
                <ListItemSecondaryAction >
                    <IconButton aria-label="Detalle" edge="end"
                        onClick={(e) => handleView(obj)}>
                        <Visibility fontSize="small" />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)}
        </List>

    }

    const handleView = (obj) => {
        history.push(`/Taxonomia/Estructura/Detalle/${obj._id}`)
    }
    const a11yProps=(index) =>{
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
      }
    return (
        <React.Fragment>
            <div className={classes.header}>
                <Typography variant="h5" className={classes.title}>Detalle de Especie</Typography>
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
                            <Tab label="Información General" {...a11yProps(0)} />
                            <Tab label="Nomenclatura" {...a11yProps(1)} />
                            <Tab label="Fenología" {...a11yProps(2)} />
                            <Tab label="Hábitat" {...a11yProps(2)} />
                            <Tab label="Amenazas" {...a11yProps(2)} />
                            <Tab label="Galería" {...a11yProps(3)} />
                        </Tabs>
                    </AppBar>
                    
                    <TabPanel value={value} index={0}>                        
                        <CardContent>                        
                    {obj && <Grid container spacing={5}>
                        <Grid item xs={4}>
                        <div className={classesList.root}>
                        <GridList  cellHeight={180} spacing={1} className={classesList.gridList}>
                            <GridListTile key={1} cols={2} rows={1.6}>
                                <img src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=uploads/taxonomia/1599733355666.jpg`}  />
                                <GridListTileBar
                                // title={"Individuo"}
                                titlePosition="bottom"
                                actionIcon={
                                    <>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <GetAppOutlined />
                                    </IconButton>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <EditOutlined />
                                    </IconButton>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <DeleteOutlined />
                                    </IconButton>
                                    </>
                                }
                                //actionPosition="left"
                                className={classesList.titleBar}
                                />
                            </GridListTile>
                            <GridListTile key={1} cols={2} rows={1.6}>
                                <img src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=uploads/taxonomia/1599733355668.jpg`}  />
                                <GridListTileBar
                                // title={"Individuo"}
                                titlePosition="bottom"
                                actionIcon={
                                    <>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <GetAppOutlined />
                                    </IconButton>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <EditOutlined />
                                    </IconButton>
                                    <IconButton aria-label={`star Individuo`} className={classesList.icon}>
                                        <DeleteOutlined />
                                    </IconButton>
                                    </>
                                }
                                //actionPosition="left"
                                className={classesList.titleBar}
                                />
                            </GridListTile>
                        </GridList>
                        </div>
                                        {/* <img src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=uploads/taxonomia/1599733355666.jpg`} width="300" height="300"/>
                                        <img src={`${process.env.REACT_APP_BASE_URL}/utils/img?path=uploads/taxonomia/1599733355668.jpg`} width="300" height="300"/> */}
                        </Grid>
                        <Grid container xs={8} spacing={5}>
                            <Grid item xs={6}>
                                <List>
                                    <ListItem divider key={obj._id}>
                                        <ListItemText primary={<Typography variant="h5">{obj.nombre}</Typography>}
                                            secondary={obj.tipo.label}>
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem key="categoria_UICN">
                                        <ListItemText primary={CategoriaUICN.find(elem => elem._id == obj.categoria_UICN).label}
                                            secondary="Categoría Amenaza UICN">
                                        </ListItemText>
                                    </ListItem>
                                
                                    <ListItem key="clasificador">
                                        <ListItemText primary={obj.clasificador?.nombre}
                                            secondary="Clasificador">
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem key="anno_clasificacion">
                                        <ListItemText primary={obj.anno_clasificacion}
                                            secondary="Año Clasificación">
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem key="origen">
                                        <ListItemText primary={obj.origen}
                                            secondary="Origen">
                                        </ListItemText>
                                    </ListItem>
                                </List> 
                            </Grid>                       
                            <Grid item xs={6}>
                                <div className={classes.detailHeader}>
                                    <Typography variant="h6" >Clasificación</Typography>
                                </div>
                                    <Paper variant="outlined" >
                                        {renderParents()}
                                    </Paper>
                                </Grid>                          
                                    {<Grid item xs={12}>
                                    <Usos obj={obj} />
                                </Grid>}
                        </Grid> 
                        {/* {childrens && <Grid item xs={6}>
                            <Childrens obj={obj} childrens={childrens} handleView={handleView} />
                        </Grid>} */}
                    </Grid>} 
                        </CardContent>
                        {obj && obj._id && <CardActions className={classes.detailActionsRight}>
                            <Button variant="contained" color="primary" disabled={Loading}
                                onClick={() => history.push(`/Taxonomia/Especie/Formulario/${obj._id}`)}>
                                Editar</Button>
                            <Button variant="contained" color="primary" disabled={Loading}
                                onClick={(e) => handleDelete(obj)}>Eliminar</Button>
                        </CardActions>}
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <CardContent>
                        {obj && <Grid container spacing={3}>                            
                        
                            {<Grid item xs={6}>
                                <Sinonimias obj={obj} />
                            </Grid>}
                            {<Grid item xs={6}>
                                <NombresComunes obj={obj} />
                            </Grid>}                            
                            {/* {childrens && <Grid item xs={6}>
                                <Childrens obj={obj} childrens={childrens} handleView={handleView} />
                            </Grid>} */}
                        </Grid>} 
                        </CardContent>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                    Item Three
                    </TabPanel>
            </Card>
        </React.Fragment >
    )
}