import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import useStyles from "../../../style";
import { useSnackbar } from "notistack";
import {
  LOADING_START,
  LOADING_END,
  SERVER_ERROR,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { useSelector } from "react-redux";
import { userAuthenticated } from "../../../Redux/selectors";
import { logout } from "../../../Redux/Actions/auth";
import Dialog from "../../../Components/Dialog";
import {
  Visibility,
  Edit,
  Delete,
  LockOpen,
  Lock,
  PermIdentity,
} from "@material-ui/icons";
import SortableCell from "../../../Components/SortableCell";
import TablePagination from "../../../Components/TablePagination";
import TableTextFilter from "../../../Components/TableTextFilter";
import { FormattedMessage, useIntl } from "react-intl";

export default ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const userAuth = useSelector((state) => userAuthenticated(state));
  const [openDialog, setOpenDialog] = useState(false);
  const [obj, setObj] = useState();
  //table pagination adnd sort
  const [page, setPage] = useState();
  const [total, setTotal] = useState();
  const [row, setRow] = useState();
  const [filtro, setFiltro] = useState("");
  const [sort, setSort] = useState();
  const intl = useIntl();

  useEffect(() => {
    list();
  }, [page, row, filtro, sort]);

  const list = async () => {
    try {
      dispatch({ type: LOADING_START });
      let params = `row=${row}&page=${page}`;
      if (filtro) {
        params += `&filtro=${filtro}`;
      }
      if (sort) {
        params += `&sort=${sort}`;
      }
      const result = await apiCall(`/institucion?${params}`, null, null, "GET");
      const { data, count } = result.data;
      setData(data);
      setTotal(count);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      history.push("/error");
    }
  };
  const handleAdd = () => {
    history.push(`/Configuracion/Institucion/Formulario`);
  };
  const handleEdit = (e, obj) => {
    history.push(`/Configuracion/Institucion/Formulario/${obj._id}`);
  };
  const handleDetail = (e, obj) => {
    history.push(`/Configuracion/Institucion/Detalle/${obj._id}`);
  };
  const handleDelete = (e, obj) => {
    setOpenDialog(true);
    setObj(obj);
  };
  const handleCancelDelete = () => {
    setOpenDialog(false);
  };
  const handleOkDelete = async () => {
    try {
      dispatch({ type: LOADING_START });
      setOpenDialog(false);
      const result = await apiCall(
        `/institucion/${obj._id}`,
        null,
        null,
        "DELETE"
      );
      dispatch({ type: LOADING_END });
      if (result) {
        //si el trabajador eliminado es el autenticado hacer logout
        if (userAuth._id === obj._id) {
          dispatch(logout());
        } else {
          list();
        }
        enqueueSnackbar(result.data.message, { variant: "success" });
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
  async function handleLock(e, obj) {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(
        `/institucion/${obj._id}`,
        { activo: !obj.activo },
        null,
        "PUT"
      );
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
      }
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    } finally {
      list();
    }
  }
  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="page.institucion.list.title" />
        </Typography>
        <Button
          color="primary"
          variant="contained"
          className={classes.btnMargin}
          onClick={handleAdd}
        >
          <FormattedMessage id="page.institucion.list.btn_new" />
        </Button>
      </div>
      <TableContainer component={Paper}>
        <TableTextFilter
          setPage={setPage}
          filtro={filtro}
          setFiltro={setFiltro}
          placeholder={intl.formatMessage({
            id: "page.institucion.list.search",
          })}
        />
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <SortableCell
                columnKey="nombre"
                columnLabel={intl.formatMessage({id: "institucion.attr.nombre"})}
                sort={sort}
                setSort={setSort}
              />
              <TableCell><FormattedMessage id="institucion.attr.pais" /></TableCell>
              <SortableCell
                columnKey="tipo_coleccion"
                columnLabel={intl.formatMessage({
                  id: "institucion.attr.tipocoleccion",
                })}
                sort={sort}
                setSort={setSort}
              />
              <SortableCell
                columnKey="es_privado"
                columnLabel={intl.formatMessage({
                  id: "institucion.attr.privado",
                })}
                sort={sort}
                setSort={setSort}
              />
              <SortableCell
                columnKey="activo"
                columnLabel={intl.formatMessage({
                  id: "institucion.attr.activo",
                })}
                sort={sort}
                setSort={setSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Tooltip
                    title={intl.formatMessage({ id: "table.btn.detail" })}
                  >
                    <IconButton
                      onClick={(e) => handleDetail(e, row)}
                      color="inherit"
                      aria-label={intl.formatMessage({
                        id: "table.btn.detail",
                      })}
                      size="small"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={intl.formatMessage({ id: "table.btn.edit" })}>
                    <IconButton
                      onClick={(e) => handleEdit(e, row)}
                      color="inherit"
                      aria-label={intl.formatMessage({ id: "table.btn.edit" })}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={intl.formatMessage({ id: "table.btn.delete" })}
                  >
                    <IconButton
                      onClick={(e) => handleDelete(e, row)}
                      color="inherit"
                      aria-label={intl.formatMessage({
                        id: "table.btn.delete",
                      })}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {row.activo && userAuth._id != row._id && (
                    <Tooltip
                      title={intl.formatMessage({ id: "table.btn.desactivar" })}
                    >
                      <IconButton
                        onClick={(e) => handleLock(e, row)}
                        color="inherit"
                        aria-label={intl.formatMessage({
                          id: "table.btn.desactivar",
                        })}
                        size="small"
                      >
                        <Lock fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {!row.activo && userAuth._id != row._id && (
                    <Tooltip
                      title={intl.formatMessage({ id: "table.btn.activar" })}
                    >
                      <IconButton
                        onClick={(e) => handleLock(e, row)}
                        color="inherit"
                        aria-label={intl.formatMessage({
                          id: "table.btn.activar",
                        })}
                        size="small"
                      >
                        <LockOpen fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.pais ? row.pais.nombre : ""}</TableCell>
                <TableCell>{row.tipo_coleccion}</TableCell>
                <TableCell>
                  <Typography color={row.es_privado ? "primary" : "error"}>
                    {row.es_privado ? intl.formatMessage({ id: "si" }) : intl.formatMessage({ id: "no" })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color={row.activo ? "primary" : "error"}>
                    {row.activo ? intl.formatMessage({ id: "si" }) : intl.formatMessage({ id: "no" })}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          row={row}
          setRow={setRow}
          page={page}
          setPage={setPage}
          total={total}
        />
      </TableContainer>
      <Dialog
        title={intl.formatMessage({id: "page.institucion.list.dialog.title"})}
        key="dialog"
        body={intl.formatMessage({id: "page.institucion.list.dialog.body"})}
        open={openDialog}
        handlerOk={handleOkDelete}
        handleCancel={handleCancelDelete}
      />
    </React.Fragment>
  );
};
