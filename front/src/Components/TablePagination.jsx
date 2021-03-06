import React, { useEffect } from "react";
import { TablePagination } from "@material-ui/core";


export default ({ page=0, setPage, row=5, setRow, total}) => {    
    const handleChangePage = (event, page) => {
        setPage(page)
    }
    const handleChangeRowsPerPage = (e) => {
        setPage(0)
        setRow(e.target.value)
    }
     useEffect(() => {
            setRow(row)
            setPage(page)
    }, [])
    return (
        <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={total?total:0}
                    rowsPerPage={row}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                //className={classes.pagination}

                />
    )
}