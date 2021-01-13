import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Collapse,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Settings from "@material-ui/icons/Settings";
import { logout } from "../Redux/Actions/auth";
import ListItemLink from "./ListItemLink";
import useStyles from "../style";
import {
  ExitToApp,
  Home,
  AccountCircle,
  Nature,
  Search,
  NatureOutlined,
  LocalPharmacyOutlined,
  AccountTreeOutlined,
  ExtensionOutlined,
  OfflineBoltOutlined,
  SupervisedUserCircleOutlined,
  HomeWorkOutlined,
  PublicOutlined,
  PeopleAltOutlined,
} from "@material-ui/icons";
import { userAuthenticated } from "../Redux/selectors";
import { hasPermition } from "../Auth/auth";
import Language from "./language";
import { FormattedMessage,useIntl } from "react-intl";

export default ({ history }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const userAuth = useSelector((state) => userAuthenticated(state));
  const intl = useIntl();

  const [open, setOpen] = useState(false);
  const [openModulo, setOpenModulo] = useState("Configuracion");
  const [isOpenModulo, setIsOpenModulo] = useState(true);
  const modulesKey = {
    CONFIGURACION: "Configuracion",
    TAXONOMIA: "Taxonomia",
  };
  //para menu profile
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "account-menu";
  const renderMenu = (
    <Menu
      id={menuId}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      anchorEl={anchorEl}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem disabled>{userAuth.nombre}</MenuItem>
      <Divider />
      <ListItemLink
        to={`/Configuracion/Trabajador/Detalle/${userAuth._id}`}
        component="li"
        primary={intl.formatMessage({ id: 'nav.misdatos' })}
      />
    </Menu>
  );

  const handleModuloClick = (modulo) => {
    if (modulo == openModulo) {
      setIsOpenModulo(!isOpenModulo);
    } else {
      setOpenModulo(modulo);
      setIsOpenModulo(true);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlerLogout = () => {
    dispatch(logout());
  };

  return [
    <AppBar
      key="appBar"
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h4" className={classes.title}>
          Fenix
        </Typography>
        <Typography variant="h6" className={classes.title}>
          <FormattedMessage
            id="nav.title"
          />
        </Typography>
        <Language />
        <Button
          color="inherit"
          className={classes.menuButton}
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
          startIcon={<AccountCircle />}
        >
          {userAuth.usuario}
        </Button>

        <Button
          color="inherit"
          onClick={handlerLogout}
          startIcon={<ExitToApp />}
        >
          <FormattedMessage
            id="nav.logout"
          />
        </Button>
      </Toolbar>
      {renderMenu}
    </AppBar>,

    <Drawer
      key="drawer"
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      open={open}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />

      <List>
        <ListItemLink
          to="/"
          primary={intl.formatMessage({ id: 'nav.menu.inicio' })}
          icon={<Home />}
        />
        {hasPermition(
          ["Administrador", "Administrador_General"],
          userAuth.roles
        ) && [
          <ListItem
            button
            onClick={(e) => handleModuloClick(modulesKey.CONFIGURACION)}
            key={modulesKey.CONFIGURACION}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'nav.menu.configuracion' })} />
            {openModulo == modulesKey.CONFIGURACION && isOpenModulo ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>,
          <Collapse
            in={openModulo == modulesKey.CONFIGURACION && isOpenModulo}
            timeout="auto"
            unmountOnExit
            key="ConfiguracionMenu"
          >
            <List component="div" disablePadding>
              <ListItemLink
                to="/Configuracion/Trabajadores"
                primary={intl.formatMessage({ id: 'nav.menu.trabajadores' })}
                icon={<PeopleAltOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Configuracion/Paises"
                primary={intl.formatMessage({ id: 'nav.menu.paises' })}
                icon={<PublicOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Configuracion/Instituciones"
                primary={intl.formatMessage({ id: 'nav.menu.jardines' })}
                icon={<HomeWorkOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Configuracion/Colectores"
                primary={intl.formatMessage({ id: 'nav.menu.colectores' })}
                icon={<SupervisedUserCircleOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Configuracion/Amenazas"
                primary={intl.formatMessage({ id: 'nav.menu.amenazas' })}
                icon={<OfflineBoltOutlined />}
                classes={classes.nested}
              />
            </List>
          </Collapse>,
        ]}
        {hasPermition(
          ["Taxonomo_General", "Administrador_General"],
          userAuth.roles
        ) && [
          <ListItem
            button
            onClick={(e) => handleModuloClick(modulesKey.TAXONOMIA)}
            key={modulesKey.TAXONOMIA}
          >
            <ListItemIcon>
              <Nature />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'nav.menu.taxonomia' })}/>
            {openModulo == modulesKey.TAXONOMIA && isOpenModulo ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>,
          <Collapse
            in={openModulo == modulesKey.TAXONOMIA && isOpenModulo}
            timeout="auto"
            unmountOnExit
            key="TaxonomiaMenu"
          >
            <List component="div" disablePadding>
              <ListItemLink
                to="/Taxonomia/TipoEstructura"
                primary={intl.formatMessage({ id: 'nav.menu.tipoestructura' })}
                icon={<ExtensionOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Taxonomia/Estructura"
                primary={intl.formatMessage({ id: 'nav.menu.estructura' })}
                icon={<AccountTreeOutlined />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Taxonomia/Filtro"
                primary={intl.formatMessage({ id: 'nav.menu.filtro' })}
                icon={<Search />}
                classes={classes.nested}
              />
              <ListItemLink
                to="/Taxonomia/Especies"
                primary={intl.formatMessage({ id: 'nav.menu.taxones' })}
                icon={<NatureOutlined />}
                classes={classes.nested}
              />

              <ListItemLink
                to="/Taxonomia/Usos"
                primary={intl.formatMessage({ id: 'nav.menu.usos' })}
                icon={<LocalPharmacyOutlined />}
                classes={classes.nested}
              />
            </List>
          </Collapse>,
        ]}
      </List>
      <Divider />
    </Drawer>,
  ];
};
