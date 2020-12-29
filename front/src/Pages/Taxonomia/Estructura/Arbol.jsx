import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import useStyles from "./style";
import { Button, Grid, Toolbar, Card, CardContent, AppBar, Tabs, Tab, Box } from "@material-ui/core";
import {
  Visibility,
  SupervisorAccount,
  ExpandMore,
  ChevronRight,
  Edit,
  Delete,
  AccountTree,
  ViewList,
} from "@material-ui/icons";
import { apiCall } from "../../../Redux/Api";
import { useDispatch, useSelector } from "react-redux";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import useStyles1 from "../../../style";
import _arbol from "./_arbol";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default ({ history }) => {
  const classes = useStyles1();
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const Loading = useSelector((state) => loading(state));

  const [nodes, setNodes] = useState();

  useEffect(() => {
    rootNode();
  }, []);

  const rootNode = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/estructura/Root`, null, null, "GET");
      setNodes(result.data);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      history.push("/error");
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAddEstructura = () => {
    history.push(`/Taxonomia/Estructura/Formulario`);
  };
  const handleAddTaxon = () => {
    history.push(`/Taxonomia/Especie/Formulario`);
  };
  const handleView = (e, node1) => {
    if (node1 && node1.tipo && node1.tipo.vista_ampliada) {
      history.push(`/Taxonomia/Especie/Detalle/${node1._id}`);
    } else {
      history.push(`/Taxonomia/Estructura/Detalle/${node1._id}`);
    }
  };

  return (
    <>
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Árbol Taxonómico
        </Typography>
        {
          <Grid className={classes.btnGroup1}>
            <Button
              variant="contained"
              size="small"
              color={"primary"}
              onClick={handleAddEstructura}
            >
              Adicionar Clasificación
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={handleAddTaxon}
            >
              Adicionar Taxón
            </Button>
          </Grid>
        }
      </Toolbar>
      <Card>
        <CardContent>
        <_arbol handleView={handleView} nodes={nodes} /> 
          {/* <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="off"
              indicatorColor="primary"
              textColor="primary"
              aria-label="scrollable prevent tabs example"
            >
              <Tab icon={<AccountTree />} aria-label="Árbol" />
              <Tab
                icon={<ViewList />}
                aria-label="Lista"
              />             
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <_arbol />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel> */}
        </CardContent>
      </Card>
    </>
  );
};
