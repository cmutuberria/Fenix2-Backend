import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import useStyles from "./style";
import {
  Button,
  Grid,
  Toolbar,
  Card,
  CardContent,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
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

function GmailTreeView(props) {
  const {
    node,
    nodeId,
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    handleView,
    ...other
  } = props;
  const classes = useStyles();
  const [childNodes, setChildNodes] = React.useState(null);
  const [expanded, setExpanded] = React.useState([]);

  async function fetchChildNodes(id) {
    const result = await apiCall(
      `/estructura/Childrens/${id}`,
      null,
      null,
      "GET"
    );
    // return result.data.obj[0].hijos;
    return result.data.obj;
  }

  const handleChange = async (event, nodes) => {
    const expandingNodes = nodes.filter((x) => !expanded.includes(x));
    setExpanded(nodes);

    if (expandingNodes[0]) {
      const childId = expandingNodes[0];
      const hijos = await fetchChildNodes(childId);
      setChildNodes(
        hijos.map((node) => (
          <GmailTreeView
            node={node}
            key={node._id}
            nodeId={node._id}
            labelText={node.nombre}
            labelIcon={SupervisorAccount}
            labelInfo={node.tipo.label}
            handleView={handleView}
            color="#1a73e8"
            bgColor="#e8f0fe"
          />
        ))
      );
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
      <TreeItem
        nodeId={nodeId}
        label={
          <div className={classes.labelRoot}>
            <div className={classes.labelText}>
              <Typography variant="body2" className={classes.labelPrimary}>
                {labelText}
              </Typography>
              <Typography
                variant="caption"
                color="inherit"
                className={classes.labelSecondary}
              >
                {labelInfo}
              </Typography>
            </div>
            <div className={classes.labelIcons}>
              <Visibility
                fontSize="small"
                onClick={(e) => handleView(e, node)}
              />
            </div>
          </div>
        }
        style={{
          "--tree-view-color": color,
          "--tree-view-bg-color": bgColor,
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

export default ({ handleView, nodes }) => {
  const dispatch = useDispatch();
  const classes = useStyles1();
  const Loading = useSelector((state) => loading(state));
  
  
  return <>
  
  {nodes?.map((node) => (
    <GmailTreeView
      node={node}
      key={node._id}
      nodeId={node._id}
      labelText={node.nombre}
      labelIcon={SupervisorAccount}
      labelInfo={node.tipo.label}
      handleView={handleView}
      color="#1a73e8"
      bgColor="#e8f0fe"
    />
  ))}
  </>
  
};
