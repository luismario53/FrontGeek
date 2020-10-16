import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

/**Importacion de componentes */
import Navigation from '../src/components/Navigation';
import Usuarios from '../src/components/Usuarios';
import Categorias from '../src/components/Categorias';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Navigation />
                {/**Configuracion de las rutas */}
                <Switch>
                    <Route exact path="/" component={Usuarios} />
                    <Route exact path="/categorias" component={Categorias} />
                    <Route exact path="/productos" />
                    <Route exact path="/empleados" />
                    <Route exact path="/usuarios" />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
