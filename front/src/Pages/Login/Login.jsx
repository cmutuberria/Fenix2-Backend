import React from "react";
import { Redirect} from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardActions, Button, TextField, Typography } from "@material-ui/core";
import useStyles from "./styles";
import MySnackbarContentWrapper from '../../Components/MySnackbar'
import LinearProgress from '../../Components/LinearProgress'
import { login } from '../../Redux/Actions/auth'
import { isAuthenticated, authError,authLoading } from '../../Redux/selectors'
import useForm from '../../useForm';



export default () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const isAuth = useSelector(state => isAuthenticated(state));
    const AuthError = useSelector(state => authError(state));
    const AuthLoading = useSelector(state => authLoading(state));

    const { handleChange, handleSubmit, values, errors } = useForm(
        submit,
        validateLogin, null, null
    );    

    function validateLogin(values){
        let errors = {};
        if (!values.username) {
            errors.username = "El Usuario es requerido";
        }
        if (!values.password) {
            errors.password = "La contraseña es is requerida";
        }
        return errors;
    }
    function submit () {
        dispatch(login(values));
    }

    if (isAuth) {
        return (<Redirect to='/' />)
    } else {
        return (
            <div className={classes.root}>
                <Card className={classes.card}>
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent>
                            <Typography variant="h3" noWrap className={classes.title}>Autenticación</Typography>
                                {AuthError && <MySnackbarContentWrapper
                                    variant="error"
                                    className={classes.snack}
                                    message={AuthError}
                                />}
                                {AuthLoading && <LinearProgress className={classes.snack} color="secondary"/>}
                                <TextField
                                    className={classes.textField}
                                    label="Usuario"
                                    name="username"
                                    id="username"
                                    onChange={handleChange}
                                    value={values.username|| ''}
                                    error={errors.username?true:false}
                                    helperText={errors.username} 
                                />
                                <TextField
                                    type="password"
                                    className={classes.textField}
                                    label="Contraseña"
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    value={values.password|| ''}
                                    error={errors.password?true:false}
                                    helperText={errors.password} 
                                />
                        </CardContent>
                        <CardActions className={classes.actions}>
                            <Button variant="contained" type="submit" color="primary">Entrar</Button>
                        </CardActions>
                    </form>
                </Card>
            </div>

        )
    }
}