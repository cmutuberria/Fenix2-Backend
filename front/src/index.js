import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import configureStore from './Redux/store';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';


const store = configureStore();

// add action to all snackbars
const notistackRef = React.createRef();
const onClickDismiss = key => () => {
  notistackRef.current.closeSnackbar(key);
}

// ReactDOM.render(<ThemeProvider theme={theme} >
ReactDOM.render(
     <Provider store={store}>
        <SnackbarProvider maxSnack={2} ref={notistackRef}
            anchorOrigin = {{vertical: 'top',horizontal: 'right'}}
            action={(key) => (
                <IconButton onClick={onClickDismiss(key)}>
                    <Close/>
                </IconButton>
            )}>
                <App/>
        </SnackbarProvider>
    </Provider>, document.getElementById('root'));

