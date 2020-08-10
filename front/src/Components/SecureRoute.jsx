import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import { userAuthenticated, isAuthenticated } from "../Redux/selectors"
import {  hasPermition } from "../Auth/auth";

export default (props)=>{
    const userIsAuth = useSelector(state => isAuthenticated(state));
    const userAuth = useSelector(state => userAuthenticated(state));
    return(
        userIsAuth ?
            hasPermition(props.roles, userAuth.roles) ? <Route {...props} /> : <Redirect to='/Secure' />
            : <Redirect to='/login' />        
    )
}