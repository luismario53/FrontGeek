import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class Inicio extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <Container>
                <h1>Bienvenido al inicio</h1>
            </Container>
        );
    }
}

export default Inicio;