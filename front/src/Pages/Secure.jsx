import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import useStyles from '../style'

export default () => {
     const classes = useStyles();
     return (
          <Paper className={classes.secureMsg} key="paper">
               <Typography key="3" variant="h4" color="error">No tiene suficientes privilegios</Typography>
          </Paper>
     )







}