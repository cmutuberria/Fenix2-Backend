import React from 'react';
import { Typography, Paper } from '@material-ui/core';
import useStyles from '../style'
import {FormattedMessage} from 'react-intl';

export default () => {
     const classes = useStyles();
     return (
          <Paper className={classes.secureMsg} key="paper">
               <Typography key="3" variant="h4" color="error">
                    <FormattedMessage 
                    id="page.secure.msg"
                    defaultMessage="Mensaje por defecto"
                    /></Typography>
          </Paper>
     )







}