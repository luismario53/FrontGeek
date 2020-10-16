import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

/**Importacion de componentes */
import Navigation from '../src/components/Navigation';
import Usuarios from '../src/components/Usuarios';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Navigation />
                {/**Configuracion de las rutas */}
                <Switch>
                    <Route exact path="/" component={Usuarios} />
                    <Route exact path="/autos" />
                    <Route exact path="/piezas" />
                    <Route exact path="/ventas" />
                    <Route exact path="/reportes" />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
