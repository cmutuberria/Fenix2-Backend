import React from 'react';

import useStyles from '../style'
import { Typography, Paper, Button } from '@material-ui/core';



export default ({history}) => {
    const classes = useStyles();

    const handleAdd = () => {
        history.push(`/Taxonomia/Especie/Upload`)
    }
    return (
            <Paper className={classes.root} key="paper">
                <Typography key="3">Bienvenido a Fenix V2</Typography>
                <Button color="primary" variant="contained"
                    className={classes.btnMargin}
                    onClick={handleAdd}>upload</Button>
            </Paper>
    )







}