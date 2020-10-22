import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from 'axios';

/**Importacion de componentes */
import Navigation from '../src/components/Navigation';
import Usuarios from '../src/components/Usuarios';
import Categorias from '../src/components/Categorias';
import Productos from '../src/components/Productos';
import Login from '../src/components/Login';
import Inicio from '../src/components/Inicio';
import Empleados from "./components/Empleados";

class Router extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            token: '',
            id: ''
        };
    }

    componentDidMount = () => {
        axios.get("http://127.0.0.1:4000/", {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                isLogin: true,
                token: localStorage.getItem("token"),
                id: localStorage.getItem("id")
            });
        }).catch(error => {
            this.setState({ isLogin: false });
        });
    }

    render() {
        return (
            <BrowserRouter>
                {this.state.isLogin &&
                    <Navigation isLogin={this.state.isLogin} />
                }
                {/**Configuracion de las rutas */}
                <Switch>
                    {!this.state.isLogin
                        ? <Route exact path="/" component={Login} />
                        : <Route exact path="/" render={(props) => <Inicio {...props} isLogin={this.state.isLogin} token={this.state.token} id={this.state.id} />} />
                    }
                    {!this.state.isLogin
                        ? <Redirect to="/" />
                        : <Route exact path="/categorias" render={(props) => <Categorias {...props} isLogin={this.state.isLogin} token={this.state.token} id={this.state.id} />} />
                    }
                    {!this.state.isLogin
                        ? <Redirect to="/" />
                        : <Route exact path="/productos" render={(props) => <Productos {...props} isLogin={this.state.isLogin} token={this.state.token} id={this.state.id} />} />
                    }
                    {!this.state.isLogin
                        ? <Redirect to="/" />
                        : <Route exact path="/empleados" render={(props) => <Empleados {...props} isLogin={this.state.isLogin} token={this.state.token} id={this.state.id} />} />
                    }
                    {!this.state.isLogin
                        ? <Redirect to="/" />
                        : <Route exact path="/usuarios" render={(props) => <Usuarios {...props} isLogin={this.state.isLogin} token={this.state.token} id={this.state.id} />} />
                    }
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
