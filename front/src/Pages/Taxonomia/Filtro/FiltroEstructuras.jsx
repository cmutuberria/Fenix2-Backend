import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  LOADING_START,
  LOADING_END,
} from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import {
  Typography,
  TablePagination,
  Card,
  CardContent,
  Toolbar,
  FormControl,
  Input,
  InputAdornment,
  Button,
  FormHelperText,
} from "@material-ui/core";
import useStyles from "../../../style";
import { Search } from "@material-ui/icons";
import List from "./_list";
import { FormattedMessage, useIntl  } from "react-intl";

export default ({ history }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState();
  const [total, setTotal] = useState();
  const [row, setRow] = useState(10);
  const [page, setPage] = useState(0);
  const [filtro, setFiltro] = useState();
  const classes = useStyles();
  const intl = useIntl();

  const handleChange = (e) => {
    setFiltro(e.target.value);
  };
  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  };
  const handleSearch = () => {
      if (filtro) {
        setPage(0);
        search();
      }else{
        setData([])
        setTotal(0)
      }
  };
  const search = async (e) => {
    try {
      if (filtro) {
        dispatch({ type: LOADING_START });
        let params = `row=${row}&page=${page}&filtro=${filtro}`;
        const result = await apiCall(
          `/estructura/filter?${params}`,
          null,
          null,
          "GET"
        );
        setData(result.data.data);
        setTotal(result.data.count);
        dispatch({ type: LOADING_END });
      }
    } catch (err) {
      dispatch({ type: LOADING_END });
      history.push("/error");
    }
  };
  useEffect(() => {
    search();
  }, [page, row]);

  const handleChangePage = async (event, page) => {
    setPage(page);
  };
  const handleChangeRowsPerPage = (e) => {
    setPage(0);
    setRow(e.target.value);
  };
  const handleView = (node1) => {
    if (node1 && node1.tipo && node1.tipo.vista_ampliada) {
      history.push(`/Taxonomia/Especie/Detalle/${node1._id}`);
    } else {
      history.push(`/Taxonomia/Estructura/Detalle/${node1._id}`);
    }
  };
  return (
    <>
      <div className={classes.header} key="header">
        <Typography variant="h5" className={classes.title}>
          <FormattedMessage id="page.filtroestructuras.list.title"/>          
        </Typography>
      </div>
      <Card>
        <CardContent>
          <Toolbar className={classes.searchCenter}>
            {
              <FormControl >
                <Input
                  value={filtro || ""}
                  placeholder={intl.formatMessage({ id: 'page.filtroestructuras.list.search' })}
                  size="large"
                  onChange={handleChange}
                  onKeyPress={handleKey}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search fontSize="large" />
                    </InputAdornment>
                  }
                  // endAdornment={
                  //   <InputAdornment position="end">
                  //     <Button
                  //       variant="contained"
                  //       color="primary"
                  //       size="small"
                  //       onClick={handleSearch}
                  //     >
                  //       Buscar
                  //     </Button>
                  //   </InputAdornment>
                  // }
                />
                <FormHelperText>
                  <FormattedMessage id="page.filtroestructuras.list.info"/>
                </FormHelperText>
              </FormControl>              
            }
            <Button variant="contained" type="submit"
                        color="primary" size="small" onClick={handleSearch}><FormattedMessage id="buscar"/></Button>
          </Toolbar>
          <div key="badge">
            {/*  <Badge color="primary" badgeContent={data.length} >
                                <Button size="small" color="primary">Entradas</Button>
                            </Badge> */}
            <TablePagination
              //  rowsPerPageOptions={[ 10, 25,50,100]}
              component="div"
              count={total ? total : 0}
              rowsPerPage={row}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              className={classes.pagination}
            />
          </div>
          {data && <List objList={data} handleView={handleView} />}
          {total == 0 && (
            <Typography variant="body1" className={classes.title}>
              <FormattedMessage id="no_data"/>              
            </Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};
