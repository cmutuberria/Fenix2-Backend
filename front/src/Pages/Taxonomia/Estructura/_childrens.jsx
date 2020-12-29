import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Grid,
  Button,
  IconButton,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
import {
  Edit,
  Delete,
  Visibility,
  ExpandMore,
  ExpandLess,
} from "@material-ui/icons";
import { loading } from "../../../Redux/selectors";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TableTextFilter from "../../../Components/TableTextFilter";
import SortableCell from "../../../Components/SortableCell";
import TablePagination from '../../../Components/TablePagination';

export default ({ obj, handleView }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [elements, setElements] = useState([]);
  const [selectedChild, setSelectedChild] = useState();
  const Loading = useSelector((state) => loading(state));
  const { enqueueSnackbar } = useSnackbar();
  const [serverErrors, setServerErrors] = useState();
  const [tipos, setTipos] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [row, setRow] = useState(10);
  const [filtro, setFiltro] = useState("");
  const [sort, setSort] = useState();

  useEffect(() => {
    if (row) {
      loadChildrens();
    }
  }, [page, row, filtro, sort]);

  useEffect(() => {
    if (obj) {
      loadTipos();
      loadChildrens();
    }
  }, [obj]);

  const loadChildrens = async () => {
    try {
      dispatch({ type: LOADING_START });
      let params = `_id=${obj._id}&row=${row}&page=${page}`;
      if (filtro) {
        params += `&filtro=${filtro}`;
      }
      if (sort) {
        params += `&sort=${sort}`;
      }
      const result = await apiCall(
        `/estructura/all-Childrens?${params}`,
        null,
        null,
        "GET"
      );
      const { data, count } = result.data;
      setElements(data);
      setTotal(count);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      //history.push("/error")
    }
  };

  const loadTipos = async () => {
    try {
      dispatch({ type: LOADING_START });
      const result = await apiCall(
        `/tipoEstructura/clasificacion-Childrens/${obj.tipo._id}`,
        null,
        null,
        "GET"
      );
      setTipos(result.data.obj);
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
      //history.push("/error")
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  function validateForm() {
    let errors1 = {};
    if (!values.tipo) {
      errors1.tipo = "El tipo es requerido";
    }
    if (!values.nombre) {
      errors1.nombre = "El nombre es requerido";
    }
    setErrors(errors1);
    return errors1;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (Object.keys(validateForm()).length === 0) {
        dispatch({ type: LOADING_START });
        const objSubmit = { ...values, padre: obj };
        let result = null;
        if (selectedChild) {
          result = await apiCall(
            `/estructura/${selectedChild._id}`,
            objSubmit,
            null,
            "PUT"
          );
        } else {
          result = await apiCall(`/estructura`, objSubmit, null, "POST");
        }
        if (result) {
          enqueueSnackbar(result.data.message, { variant: "success" });
          loadChildrens();
          resetData();
        }
        dispatch({ type: LOADING_END });
      }
    } catch (err) {
      dispatch({ type: LOADING_END });
      if (err.response.data.errors) {
        Object.keys(err.response.data.errors).map((elem) => {
          errors = {
            ...errors,
            [elem]: err.response.data.errors[elem].message,
          };
        });
        setServerErrors(errors);
      } else {
        dispatch({ type: SERVER_ERROR, error: err });
        //history.push("/error")
      }
    }
  }

  const resetData = () => {
    setValues({});
    setErrors({});
    setSelectedChild();
  };
  const handlerDelete = async (item) => {
    try {
      dispatch({ type: LOADING_START });
      let result = null;
      result = await apiCall(`/estructura/${item._id}`, null, null, "DELETE");
      if (result) {
        enqueueSnackbar(result.data.message, { variant: "success" });
        loadChildrens();
        resetData();
      }
      dispatch({ type: LOADING_END });
    } catch (err) {
      dispatch({ type: LOADING_END });
      dispatch({ type: SERVER_ERROR, error: err });
    }
  };
  return (
    <React.Fragment>
      <div className={classes.detailHeader}>
        <Typography variant="h6">Clasificaciones Inferiores</Typography>
        {!showForm && tipos && tipos.length > 0&& (
          <Button
            endIcon={<ExpandMore />}
            size="small"
            onClick={() => setShowForm(!showForm)}
          >
            Mostrar
          </Button>
        )}
        {showForm && tipos && tipos.length > 0 && (
          <Button
            endIcon={<ExpandLess />}
            size="small"
            onClick={() => setShowForm(!showForm)}
          >
            Ocultar
          </Button>
        )}
      </div>
      {showForm &&  (
        <Grid>
          <form
            onSubmit={handleSubmit}
            noValidate
            className={classes.formInline}
          >
            {tipos && tipos.length > 0 && (
              <Autocomplete
                autoComplete
                className={classes.autocompleteInline}
                options={tipos}
                getOptionLabel={(option) => option.label}
                id="tipo"
                name="tipo"
                value={values.tipo || null}
                onChange={(event, newValue) => {
                  handleChange({ target: { name: "tipo", value: newValue } });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tipo*"
                    className={classes.miniTextFieldInline}
                    error={errors.tipo ? true : false}
                    helperText={errors.tipo}
                  />
                )}
              />
            )}
            <TextField
              className={classes.miniTextFieldInline}
              label="Nombre*"
              name="nombre"
              id="nombre"
              onChange={handleChange}
              value={values.nombre || ""}
              error={errors.nombre ? true : false}
              helperText={errors.nombre}
            />
            <Button
              variant="contained"
              type="submit"
              color="primary"
              size="small"
              disabled={Loading}
            >
              Salvar
            </Button>
          </form>
        </Grid>
      )}
      <Paper variant="outlined">
        <TableContainer component={Paper}>
          <TableTextFilter
            setPage={setPage}
            filtro={filtro}
            setFiltro={setFiltro}
            placeholder="Buscar"
          />
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <SortableCell
                  columnKey="nombre"
                  columnLabel="Nombre"
                  sort={sort}
                  setSort={setSort}
                />
                <SortableCell
                  columnKey="tipo"
                  columnLabel="Tipo"
                  sort={sort}
                  setSort={setSort}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {elements.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Tooltip title="Detalle">
                      <IconButton
                        onClick={(e) => handleView(row)}
                        color="inherit"
                        aria-label="Editar"
                        size="small"
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={(e) => {
                          setSelectedChild(row);
                          setValues(row);
                          setShowForm(true);
                        }}
                        color="inherit"
                        aria-label="Editar"
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={(e) => handlerDelete(row)}
                        color="inherit"
                        aria-label="Eliminar"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.tipo.label}</TableCell>
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
      </Paper>
    </React.Fragment>
  );
};
