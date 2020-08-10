import React from "react";
import { Toolbar, FormControl, Input, InputAdornment, IconButton } from "@material-ui/core";
import { Search, Clear } from "@material-ui/icons";
import useStyles from '../style'


export default ({ setPage, filtro, setFiltro, placeholder }) => {
    const classes = useStyles();
    const handleChangeFiltro = (e) => {
        const { value } = e.target
        setFiltro(value)
        setPage(0)
    }
    const clearFiltro = (e) => {
        setFiltro("")
        setPage(0)
    }
    return (
        <Toolbar className={classes.toolbar}>
            {<form noValidate onSubmit={(e) => e.preventDefault()}>
                <FormControl>
                    <Input className={classes.miniTextField}
                        value={filtro||''}
                        placeholder={placeholder}
                        size="small"
                        onChange={handleChangeFiltro}
                        startAdornment={
                            <InputAdornment position="start">
                                    <Search fontSize="small"/>
                            </InputAdornment>}
                        endAdornment={
                            <InputAdornment position="end" >
                                <IconButton onClick={clearFiltro} disabled={!filtro} size="small" >
                                    <Clear fontSize="small"/>
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </form>}
        </Toolbar>
    )
}