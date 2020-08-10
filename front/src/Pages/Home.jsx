import React from 'react';

import useStyles from '../style'
import { Typography, Paper } from '@material-ui/core';



export default ({history}) => {
    const classes = useStyles();

    return (
            <Paper className={classes.root} key="paper">
                <Typography key="3">Bienvenido a Fenix V2</Typography>
            </Paper>
    )







}