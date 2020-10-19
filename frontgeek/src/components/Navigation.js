import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Agrícola</Navbar.Brand>
                <Nav className="mr-auto">
                    <NavLink className="nav-link" to="/" >Inicio</NavLink>
                    <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
                    <NavLink className="nav-link" to="/productos">Productos</NavLink>
                    <NavLink className="nav-link" to="/empleados">Empleados</NavLink>
                    <NavLink className="nav-link" to="/usuarios">Usuarios</NavLink>
                </Nav>
            </Navbar>
        );
    }
}

export default Navigation;