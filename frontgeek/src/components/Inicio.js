import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';

class Inicio extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    cerrarSesion = ()=>{
        localStorage.removeItem("token");
        window.location.reload();
    }

    render() {
        return (
            <Container className="mt-5">
                <h1 className="mb-3">Bienvenido al inicio</h1>
                <Button variant="info" onClick={this.cerrarSesion}>Cerrar sesión</Button>
            </Container>
        );
    }
}

export default Inicio;