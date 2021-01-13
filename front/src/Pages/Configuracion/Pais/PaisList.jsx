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
import Dialog from "../../../Components/Dialog";
import { Edit, Delete } from "@material-ui/icons";
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
    if (row) {
      list();
    }
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
      const result = await apiCall(`/pais?${params}`, null, null, "GET");
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
    history.push(`/Configuracion/Pais/Formulario`);
  };
  const handleEdit = (e, obj) => {
    history.push(`/Configuracion/Pais/Formulario/${obj._id}`);
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
      const result = await apiCall(`/pais/${obj._id}`, null, null, "DELETE");
      dispatch({ type: LOADING_END });
      if (result) {
        list();
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
  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography variant="h5" className={classes.title}>
        <FormattedMessage id="page.paises.list.title" />
        </Typography>
        <Button
          color="primary"
          variant="contained"
          className={classes.btnMargin}
          onClick={handleAdd}
        >
         <FormattedMessage id="page.paises.list.btn_new" />
        </Button>
      </div>
      <TableContainer component={Paper}>
        <TableTextFilter
          setPage={setPage}
          filtro={filtro}
          setFiltro={setFiltro}
          placeholder={intl.formatMessage({ id: 'page.paises.list.search' })}
        />
        <Table aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <SortableCell
                columnKey="nombre"
                columnLabel={intl.formatMessage({ id: 'paises.attr.nombre' })}
                sort={sort}
                setSort={setSort}
              />
              <SortableCell
                columnKey="sigla"
                columnLabel={intl.formatMessage({ id: 'paises.attr.sigla' })}
                sort={sort}
                setSort={setSort}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Tooltip title={intl.formatMessage({ id: 'table.btn.edit' })}>
                    <IconButton
                      onClick={(e) => handleEdit(e, row)}
                      color="inherit"
                      aria-label={intl.formatMessage({ id: 'table.btn.edit' })}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={intl.formatMessage({ id: 'table.btn.delete' })}>
                    <IconButton
                      onClick={(e) => handleDelete(e, row)}
                      color="inherit"
                      aria-label={intl.formatMessage({ id: 'table.btn.delete' })}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>{row.nombre}</TableCell>
                <TableCell>{row.sigla}</TableCell>
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
        title={intl.formatMessage({ id: 'page.paises.list.dialog.title' })}
        key="dialog"
        body={intl.formatMessage({ id: 'page.paises.list.dialog.body' })}
        open={openDialog}
        handlerOk={handleOkDelete}
        handleCancel={handleCancelDelete}
      />
    </React.Fragment>
  );
};
