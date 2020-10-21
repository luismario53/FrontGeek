import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAdmin: false,
        }
    }

    componentDidMount = () => {
        axios.get("http://127.0.0.1:4000/adm", {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({ isAdmin: true });
        }).catch(error => {
            this.setState({ isAdmin: false });
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.props.isLogin &&
                    < Navbar bg="dark" variant="dark">
                        <Navbar.Brand>Agrícola</Navbar.Brand>
                        <Nav className="mr-auto">
                            <NavLink className="nav-link" to="/" >Inicio</NavLink>
                            <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
                            <NavLink className="nav-link" to="/productos">Productos</NavLink>
                            <NavLink className="nav-link" to="/empleados">Empleados</NavLink>
                            {this.state.isAdmin &&
                                <NavLink className="nav-link" to="/usuarios">Usuarios</NavLink>
                            }
                        </Nav>
                    </Navbar>
                }
            </React.Fragment>

        );
    }
}

export default Navigation;