import React from 'react';

import useStyles from '../style'
import { Typography, Paper } from '@material-ui/core';
import {FormattedMessage} from 'react-intl';


export default ({history}) => {
    const classes = useStyles();

    return (
            <Paper className={classes.root} key="paper">
                <Typography key="3">
                    <FormattedMessage 
                    id="page.home.bienvenido"
                    defaultMessage="Mensaje por defecto"
                    />
                </Typography>
            </Paper>
    )







}