import React, {useState, useEffect} from "react";
import { TableCell, TableSortLabel } from "@material-ui/core";
import useStyles from '../style'


export default ({  columnKey, columnLabel, sort, setSort}) => {
    const classes = useStyles();
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const handleSort = (property) => (event) => {
        sortField == property ? setSortDirection(sortDirection == "asc" ? "desc" : "asc") : setSortDirection("asc")
        setSortField(property)
    }
    useEffect(() => {
        if(sortField){
            sortDirection=="desc"?setSort(`-${sortField}`):setSort(sortField)
        }
    }, [sortField,sortDirection ])
    return (
        // <TableCell align="right" 
        <TableCell  
            key={columnKey}
            sortDirection={sortDirection}>
            <TableSortLabel
                active={sortField === sort||sort === `-${sortField}`}
                direction={sortDirection}
                onClick={handleSort(columnKey)}
            >
                {columnLabel}
            <span className={classes.visuallyHidden}>
                {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
            </span>
            </TableSortLabel>
        </TableCell>
    )
}