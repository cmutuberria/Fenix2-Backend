import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import theme from './theme';
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

ReactDOM.render(<ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
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
    </Provider>
  </ThemeProvider>, document.getElementById('root'));

