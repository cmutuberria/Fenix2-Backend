import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
// import { useTheme } from '@material-ui/core/styles';

export default ({ title, body, open, handlerOk, handleCancel}) =>{
    // const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const ok = ()=>{
        handlerOk()
    }
    const cancel = ()=>{
        handleCancel()
    }

    return (
            <Dialog
                keepMounted
                open={open}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>{body}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={cancel} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={ok} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
    );
}