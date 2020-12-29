import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu, MenuItem } from "@material-ui/core";
import { ExpandMore, Translate } from "@material-ui/icons";
import useStyles from "../style";
import { change_language } from "../Redux/Actions/lang";
import { langSelected } from "../Redux/selectors";
import Idiomas from "../Constant/Idiomas";

export default () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const lang = useSelector((state) => langSelected(state));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event.currentTarget.lang) {
      dispatch(change_language(event.currentTarget.lang));
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
        startIcon={<Translate />}
        endIcon={<ExpandMore />}
        className={classes.menuButton}
      >
        {Idiomas.find((e) => e._id === lang).label}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Idiomas.map((elem) => (
          <MenuItem
            key={elem._id}
            onClick={handleClose}
            lang={elem._id}
            disabled={lang === elem._id}
          >
            {elem.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
