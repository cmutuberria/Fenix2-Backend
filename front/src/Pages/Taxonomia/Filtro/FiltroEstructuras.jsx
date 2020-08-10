import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LOADING_START, LOADING_END, SERVER_ERROR } from "../../../Redux/actionTypes";
import { apiCall } from "../../../Redux/Api";
import { Paper, Typography, TablePagination } from '@material-ui/core';
import List from "../Components/_list";
import Form from "../Components/_form";
import useStyles from '../../../style'

export default ({ history }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [row, setRow] = useState(10);
    const [page, setPage] = useState(0);
    const [formValues, setFormValues] = useState();
    const classes = useStyles();

    const loadData = async () => {
        try {
            dispatch({ type: LOADING_START });
            // const result = await apiCall(`/entrada/filtro`, formValues, null, 'post');
            const result = await apiCall(`/visita/filtro`, { ...formValues, page, row }, null, 'post');
            const { data, total } = result.data.all;
            setData(data);
            setTotal(total)
            dispatch({ type: LOADING_END });
        } catch (err) {
            dispatch({ type: LOADING_END });
            dispatch({ type: SERVER_ERROR, error: err });
            history.push("/error")
        }
    };
    useEffect(() => {
        setPage(0)
        if (formValues) {
            loadData();
        }
    }, [formValues])
    useEffect(() => {
        if (formValues) {
            loadData();
        }
    }, [page, row])
    const handleChangePage = async (event, page) => {
        setPage(page)
    }
    const handleChangeRowsPerPage = (e) => {
        setPage(0)
        setRow(e.target.value)
    }

    return (
        <>
            <div className={classes.header} key="header">
                <Typography variant="h5" className={classes.title}>Entradas</Typography>
            </div>
            <Paper className={classes.card} key="paper">
                <Form setFormValues={setFormValues} />
                {data && data.length > 0 ?
                    <>
                        <div key="badge">
                            <Badge color="primary"
                                badgeContent={data.length} >
                                <Button size="small" color="primary">Entradas</Button>
                            </Badge>
                            <TablePagination
                                //rowsPerPageOptions={[2, 10, 25]}
                                component="div"
                                count={total}
                                rowsPerPage={row}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                className={classes.pagination}

                            />
                        </div>
                        <List data={data} history={history} loadData={loadData}
                            key="list" history={history} />
                    </>
                    : <Typography>Sin datos para mostrar</Typography>}
            </Paper>
        </>
    );
}