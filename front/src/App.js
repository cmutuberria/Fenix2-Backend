import React, {useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux';
import {Container } from '@material-ui/core';
import './App.css';
import NavBar from './Components/NavBar'
import useStyles from './style';
import Home from './Pages/Home';
import SecureRoute from './Components/SecureRoute';
import Login from './Pages/Login/Login';
import { isAuthenticated } from "./Redux/selectors"
import {loadUserByToken} from './Redux/Actions/auth'
import {loadLang, change_language} from './Redux/Actions/lang';
import LinearProgress from './Components/LinearProgress'
import { loading } from "./Redux/selectors"
import Error from './Pages/Error';
import 'moment/locale/es';
import Secure from './Pages/Secure';
import ChangePasswordForm from './Pages/Configuracion/Trabajador/ChangePasswordForm';
import TrabajadorDetail from './Pages/Configuracion/Trabajador/TrabajadorDetail';
import TrabajadorForm from './Pages/Configuracion/Trabajador/TrabajadorForm';
import TrabajadorList from './Pages/Configuracion/Trabajador/TrabajadorList';
import PaisList from './Pages/Configuracion/Pais/PaisList';
import PaisForm from './Pages/Configuracion/Pais/PaisForm';
import JardinList from './Pages/Configuracion/Institucion/InstitucionList';
import JardinForm from './Pages/Configuracion/Institucion/InstitucionForm';
import JardinDetail from './Pages/Configuracion/Institucion/InstitucionDetail';
import ColectorList from './Pages/Configuracion/Colector/ColectorList';
import ColectorForm from './Pages/Configuracion/Colector/ColectorForm';
import EspecieList from './Pages/Taxonomia/Especie/EspecieList';
import EspecieForm from './Pages/Taxonomia/Especie/EspecieForm';
import Arbol from './Pages/Taxonomia/Estructura/Arbol';
import EstructuraForm from './Pages/Taxonomia/Estructura/EstructuraForm';
import EstructuraDetails from './Pages/Taxonomia/Estructura/EstructuraDetails';
import EspecieDetails from './Pages/Taxonomia/Especie/EspecieDetails';
import TipoEstructuraList from './Pages/Taxonomia/TipoEstructura/TipoEstructuraList';
import TipoEstructuraForm from './Pages/Taxonomia/TipoEstructura/TipoEstructuraForm';
import UsoList from './Pages/Taxonomia/Uso/UsoList';
import UsoForm from './Pages/Taxonomia/Uso/UsoForm';
import upload from './Pages/Taxonomia/Especie/upload';
import ImagenIndividuoForm from './Pages/Taxonomia/Especie/ImagenIndividuoForm';
import MuestraHerbarioForm from './Pages/Taxonomia/Especie/MuestraHerbarioForm';
import AmenazaList from './Pages/Configuracion/Amenaza/AmenazaList';
import AmenazaForm from './Pages/Configuracion/Amenaza/AmenazaForm';
import FiltroEstructuras from './Pages/Taxonomia/Filtro/FiltroEstructuras';

// function App({store, history}) {
function App({store, history}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const lang = localStorage.getItem('lang');
  const userIsAuthenticated = useSelector(state => isAuthenticated(state));
  const Loading = useSelector(state => loading(state));

  useEffect(()=>{
    if (lang) {
      dispatch(loadLang(lang))
    }else{
      dispatch(change_language("es"))
    }
    console.log("process.env.REACT_APP_BASE_URL",process.env.REACT_APP_BASE_URL);
     if (token) {
        dispatch(loadUserByToken(token))
    }
  }, []);

  return (
      <Router>
        {Loading && <LinearProgress color="secondary" />}
        <div className={classes.root}>
          {userIsAuthenticated&&<NavBar history />}
         <Container className={classes.content}>
           <Switch>
              <SecureRoute exact path="/" component={Home}  />  
              <Route exact path="/Error" component={Error}  />  {/* ["Administrador","Portero","Directivo"] */}
              <Route exact path="/Login" component={Login}  />  
              <Route exact path="/Secure" component={Secure} /> 
              <SecureRoute exact path="/Configuracion/Trabajadores" component={TrabajadorList} roles={["Administrador_General", "Administrador"]} /> 
              <SecureRoute exact path="/Configuracion/Trabajador/Formulario" component={TrabajadorForm} roles={["Administrador_General", "Administrador"]}/> 
              <SecureRoute exact path="/Configuracion/Trabajador/Formulario/:id" component={TrabajadorForm} roles={["Administrador_General", "Administrador"]}/> 
              <SecureRoute exact path="/Configuracion/Trabajador/CambiarContraseña/:id" component={ChangePasswordForm} /> 
              <SecureRoute exact path="/Configuracion/Trabajador/Detalle/:id" component={TrabajadorDetail} /> 
              <SecureRoute exact path="/Configuracion/Jardines" component={JardinList} roles={["Administrador_General", "Administrador"]} /> 
              <SecureRoute exact path="/Configuracion/Jardin/Formulario" component={JardinForm} roles={["Administrador_General", "Administrador"]}/> 
              <SecureRoute exact path="/Configuracion/Jardin/Formulario/:id" component={JardinForm} roles={["Administrador_General", "Administrador"]}/> 
              <SecureRoute exact path="/Configuracion/Jardin/Detalle/:id" component={JardinDetail} /> 
              <SecureRoute exact path="/Configuracion/Paises" component={PaisList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Pais/Formulario" component={PaisForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Pais/Formulario/:id" component={PaisForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Colectores" component={ColectorList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Colector/Formulario" component={ColectorForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Colector/Formulario/:id" component={ColectorForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Amenazas" component={AmenazaList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Amenaza/Formulario" component={AmenazaForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Configuracion/Amenaza/Formulario/:id" component={AmenazaForm} roles={["Administrador_General"]} /> 
              {/* taxonomia */}
              <SecureRoute exact path="/Taxonomia/TipoEstructura" component={TipoEstructuraList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/TipoEstructura/Formulario" component={TipoEstructuraForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/TipoEstructura/Formulario/:id" component={TipoEstructuraForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Estructura" component={Arbol} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Estructura/Formulario" component={EstructuraForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Estructura/Formulario/:id" component={EstructuraForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Estructura/Detalle/:id" component={EstructuraDetails} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especies" component={EspecieList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especie/Formulario" component={EspecieForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especie/Formulario/:id" component={EspecieForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especie/ImgRepresentativa/:id" component={ImagenIndividuoForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especie/MuestraHerbario/:id" component={MuestraHerbarioForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Especie/Detalle/:id" component={EspecieDetails} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Usos" component={UsoList} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Uso/Formulario" component={UsoForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Uso/Formulario/:id" component={UsoForm} roles={["Administrador_General"]} /> 
              <SecureRoute exact path="/Taxonomia/Filtro" component={FiltroEstructuras} roles={["Administrador_General"]} /> 
              
              {/* <SecureRoute exact path="/Taxonomia/Especie/Upload" component={upload} roles={["Administrador_General"]} />  */}
              
           </Switch>
          </Container>
        </div>
      </Router>
  );
}

export default App;
