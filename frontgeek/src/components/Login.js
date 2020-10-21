import React, { Component } from 'react';
import axios from 'axios';
import { Button, Container, Form, Col } from 'react-bootstrap';
import "../static/css/login.css"
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert2';
import { Redirect } from 'react-router-dom';

class Login extends Component {

    correoRef = React.createRef();
    passwordRef = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                email: 'Falta información'
            },
        });
        this.state = {
            correo: "",
            password: "",
            redirect: false
        };
    }

    handleChange = () => {
        this.setState({
            correo: this.correoRef.current.value,
            password: this.passwordRef.current.value
        });
    }

    login = (e) => {
        e.preventDefault();
        axios.post("http://127.0.0.1:4000/login", {
            correo: this.state.correo,
            password: this.state.password
        }).then(response => {
            if (response.data.token === 401) {
                swal.fire({
                    title: 'Verifica tu contraseña',
                    text: 'Contraseña incorrecta',
                    icon: 'error',
                    confirmButtonText: 'Okay'
                });
            } else {
                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("rol", response.data.rol);
                window.location.reload();
                // this.setState({ redirect: true });
            }
        }).catch(error => {
            swal.fire({
                title: 'mmm',
                text: 'El usuario no existe',
                icon: 'error',
                confirmButtonText: 'chale'
            });
        });
    }

    redireccionar = () => {
        if (this.state.redirect) {
            return <Redirect to="/usuarios" />
        }
    }

    render() {
        return (
            <Container className="mt-5 container-login">
                {this.redireccionar()}
                <div className="d-flex justify-content-center">
                    <Col className="align-self-center" xs={12} sm={12} md={8} lg={6} xl={5}>
                        <Form onSubmit={this.login}>
                            <Form.Group>
                                <Form.Control ref={this.correoRef} type="text" placeholder="Correo electrónico" onChange={this.handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control ref={this.passwordRef} type="password" placeholder="Contraseña" onChange={this.handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" variant="success" className="sesion-btn">Iniciar Sesión</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </div>
                <Form.Group>
                    <Button onClick={this.validarToken} variant="success" className="sesion-btn">Validar token</Button>
                </Form.Group>
            </Container>
        );
    }
}

export default Login;