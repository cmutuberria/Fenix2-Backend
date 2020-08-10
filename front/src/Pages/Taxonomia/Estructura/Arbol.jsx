import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import useStyles from "./style";
import { Tooltip, IconButton, Button, Grid, Toolbar, Card, CardContent } from '@material-ui/core';
import { Visibility, SupervisorAccount, ExpandMore, ChevronRight, Edit, Delete } from '@material-ui/icons';
import { apiCall } from "../../../Redux/Api";
import { useDispatch, useSelector } from "react-redux";
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { loading } from "../../../Redux/selectors";
import useStyles1 from "../../../style";

function GmailTreeView(props) {
  const {node, nodeId, labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, handleView, ...other } = props;
  const classes = useStyles();
  const [childNodes, setChildNodes] = React.useState(null);
  const [expanded, setExpanded] = React.useState([]);
  const [iconAction, setIconAction] = React.useState(false);

  async function fetchChildNodes(id) {
    const result = await apiCall(`/estructura/Childrens/${id}`, null, null, 'GET');
    // return result.data.obj[0].hijos;
    return result.data.obj;
  }

  const handleChange = async (event, nodes) => { 
     const expandingNodes = nodes.filter(x => !expanded.includes(x));
    setExpanded(nodes); 
    
    if (expandingNodes[0]) {
      const childId = expandingNodes[0];
      const hijos = await fetchChildNodes(childId)
      setChildNodes(
        hijos.map(node => <GmailTreeView
          node={node}
          key={node._id}
          nodeId={node._id}
          labelText={node.nombre}
          labelIcon={SupervisorAccount}
          labelInfo={node.tipo.label}
          handleView={handleView}
          color="#1a73e8"
          bgColor="#e8f0fe" />)
      )

    }
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}  
      expanded={expanded}
      onNodeToggle={handleChange} 
    >
      {/*The node below should act as the root node for now */}
      <TreeItem nodeId={nodeId} 
        label={
          <div className={classes.labelRoot}>
            <div className={classes.labelText}>
              <Typography variant="body2" className={classes.labelPrimary}>
                {labelText}
              </Typography>
              <Typography variant="caption" color="inherit" className={classes.labelSecondary}>
                {labelInfo}
              </Typography>
            </div>
            <div className={classes.labelIcons}>
              <Visibility fontSize="small" onClick={(e)=>handleView(e, node)}/>
            </div>             
          </div>
        }
        style={{
          '--tree-view-color': color,
          '--tree-view-bg-color': bgColor,
        }}
        classes={{
          root: classes.root,
          content: classes.content,
          expanded: classes.expanded,
          //selected: classes.selected,
          //group: classes.group,
          label: classes.label,
        }}
      >
        {childNodes || [<div key="stub" />]}
      </TreeItem>
    </TreeView>
  );
}
GmailTreeView.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles1();
  const Loading = useSelector(state => loading(state));

  const [node, setNode] = useState();

  useEffect(() => {
    rootNode();
  }, [])

  const rootNode = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(`/estructura/Root`, null, null, 'GET');
      setNode(result.data[0]);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      history.push("/error")
    }
  }

  const handleAddEstructura = () => {
    history.push(`/Taxonomia/Estructura/Formulario`)
}
  const handleAddEspecie = () => {
    history.push(`/Taxonomia/Especie/Formulario`)
}
  const handleView = (e, node1) => {
    console.log(node1);
    if (node1&&node1.tipo&&node1.tipo.nombre=="especie") {      
      history.push(`/Taxonomia/Especie/Detalle/${node1._id}`)
    }else{
      history.push(`/Taxonomia/Estructura/Detalle/${node1._id}`)
    }
  }

  return (
    <>
      <Toolbar>
        <Typography variant="h5" className={classes.title}>Árbol Taxonómico</Typography>
        { <Grid className={classes.btnGroup1}>
          <Button variant="contained" size="small" 
          color={"primary"} onClick={handleAddEstructura}
          >Adicionar Estructura</Button>
          <Button variant="contained" size="small" 
          color="primary" onClick={handleAddEspecie}
          >Adicionar Especie</Button>          
        </Grid> }
      </Toolbar>
      <Card>
        <CardContent>
          {node && <GmailTreeView
            node={node}
            key={node._id}
            nodeId={node._id}
            labelText={node.nombre}
            labelIcon={SupervisorAccount}
            labelInfo={node.tipo.label}
            handleView={handleView}
            color="#1a73e8"
            bgColor="#e8f0fe" />}
        </CardContent>
      </Card>
    </>

  )
}


