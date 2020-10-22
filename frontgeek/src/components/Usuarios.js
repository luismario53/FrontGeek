import Axios from 'axios';
import React, { Component } from 'react';
import { Form, Col, Row, Container, Button, Table, InputGroup } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import swal from 'sweetalert2';
import '../static/css/usuarios.css';
import RolSelect from 'react-select-search';
//

class Usuarios extends Component {

    correoRef = React.createRef();
    passwordRef = React.createRef();
    rolRef = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                email: 'Falta información'
            },
        });
        this.state = {
            isAdmin: false,
            id: "",
            correo: "",
            password: "",
            rol: "",
            usuarios: [],
            page: 1,
            totalPages: 0,
            greenButton: "Registrar",
            ywButton: "Limpir campos",
            roles: [
                { name: "Administrador", value: "Administrador" },
                { name: "Auxiliar", value: "Auxiliar" },
                { name: "Consultor", value: "Consultor" }
            ]
        };

    }

    handleChangeRol = (rol) => {
        this.setState({ rol: rol });
    }

    changeState = () => {
        this.setState({
            correo: this.correoRef.current.value,
            password: this.passwordRef.current.value
        });
    }

    componentDidMount = () => {
        this.getUsers();
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    searchUserByRol = (e) => {
        var rol = this.capitalizeFirstLetter(e.target.value.toLowerCase());
        if (e.target.value.toLowerCase().length >= 3) {
            axios.get(`http://127.0.0.1:4000/usuarios/getbyrol/${rol}`)
                .then(response => {
                    console.log(response.data)
                    this.setState({ usuarios: response.data });
                });
        } else if (e.target.value.toLowerCase().length == 0) {
            this.getUsers();
        }
    }

    deleteUser = (id) => {
        swal.fire({
            title: 'mmm',
            text: 'Esta seguro que desea eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Okay'
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:4000/usuarios/delete/${id}`)
                    .then(response => {
                        switch (response.status) {
                            case 200: {
                                swal.fire({
                                    title: 'Listo',
                                    text: 'Usuario eliminado',
                                    icon: 'success',
                                    confirmButtonText: 'Okay'
                                });
                                this.getUsers();
                                break;
                            }
                            case 500: {
                                swal.fire({
                                    title: 'Ups',
                                    text: 'Error en el servidor',
                                    icon: 'error',
                                    confirmButtonText: 'chale'
                                });
                                break;
                            }
                        }
                    });
            }
        });
    }

    getUsers = () => {
        axios.get(`http://127.0.0.1:4000/usuarios/${this.state.page}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            this.setState({
                isAdmin: true,
                usuarios: response.data.users,
                totalPages: response.data.size
            });
        }).catch(error => {
            this.setState({ isAdmin: false });
        });
    }

    updateUser = (user) => {
        this.setState({
            id: user._id,
            correo: user.correo,
            rol: user.rol.rol,
            greenButton: "Actualizar",
            ywButton: "Cancelar"
        })
    }

    // handleButton = (e, user) => {
    //     e.preventDefault();
    //     if (this.state.greenButton === "Registrar") {
    //         this.saveUser();
    //     } else {
    //         this.updateUser(user);
    //     }
    // }

    saveUser = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            axios.post("http://127.0.0.1:4000/usuarios/add", {
                correo: this.state.correo,
                password: this.state.password,
                rol: this.state.rol
            }).then(response => {
                switch (response.status) {
                    case 202: {
                        swal.fire({
                            title: 'Error',
                            text: 'El usuario ya está registrado',
                            icon: 'error',
                            confirmButtonText: 'Okay'
                        });
                        break;
                    }
                    case 200: {
                        swal.fire({
                            title: 'Nicesu',
                            text: 'Usuario registrado',
                            icon: 'success',
                            confirmButtonText: 'Okay'
                        }).then(result => {
                            if (result) {
                                this.clearForm();
                            }
                        });
                        this.getUsers();
                        break;
                    }
                    case 500: {
                        swal.fire({
                            title: 'Ups',
                            text: 'Error en el servidor',
                            icon: 'error',
                            confirmButtonText: 'chale'
                        });
                        break;
                    }
                }
            });
        } else {
            this.forceUpdate();
            this.validator.showMessages();
        }
    }

    clearForm = () => {
        if (this.state.ywButton === "Cancelar") {
            this.setState({
                greenButton: "Registrar",
                ywButton: "Limpiar campos"
            })
        }
        this.setState({
            correo: "",
            password: "",
            rol: ""
        })
        //document.getElementById('formUsuarios').reset();
    }

    previousPage = () => {
        var { page } = this.state;
        if (page > 1) {
            this.setState({
                page: page - 1
            }, () => {
                this.getUsers();
            })
        }
    }

    nextPage = () => {
        var { page } = this.state;
        if (page < this.state.totalPages) {
            this.setState({
                page: page + 1
            }, () => {
                this.getUsers();
            })
        }
    }

    render() {
        const { usuarios } = this.state;
        const listaUsuarios = usuarios.map(usuario => {
            return (
                <tr key={usuario._id}>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol.rol}</td>
                    <td>********</td>
                    <td><Button variant="info" onClick={() => this.updateUser(usuario)}>Editar</Button></td>
                    <td><Button variant="danger" onClick={() => this.deleteUser(usuario._id)}>Eliminar</Button></td>
                </tr>
            );
        });

        return (
            <Container className="container-usuarios">
                <Row xs={1} md={1} lg={2} xl={2} className="mt-3 col-12 ml-1">
                    <Col>
                        <Form onSubmit={this.saveUser} id="formUsuarios">
                            <Form.Group>
                                <Form.Control type="text" placeholder="Correo electrónico" name="correo" ref={this.correoRef} onChange={this.changeState} value={this.state.correo}></Form.Control>
                                {this.validator.message('email', this.state.correo, 'required|email')}
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="password" placeholder="Contraseña" name="password" ref={this.passwordRef} onChange={this.changeState} value={this.state.password}></Form.Control>
                                {this.validator.message('password', this.state.password, 'required|alpha_num')}
                            </Form.Group>
                            <Form.Group>
                                <RolSelect
                                    onChange={rol => this.handleChangeRol(rol)}
                                    options={this.state.roles}
                                    placeholder="Seleccione rol"
                                    value={this.state.rol}
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Button variant="warning" onClick={this.clearForm}>{this.state.ywButton}</Button>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Button type="submit" variant="success">{this.state.greenButton}</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Col>
                    <Col className="col-8 properties-tabla-autos">
                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Buscar usuario" onKeyUp={this.searchUserByRol}></Form.Control>
                        </InputGroup>
                        <Table responsive striped bordered hover size="sm" className="tabla-mouse">
                            <thead>
                                <tr>
                                    <th>Rol</th>
                                    <th>Correo electrónico</th>
                                    <th>Contraseña</th>
                                    <th colSpan={2}>Opciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyId">
                                {listaUsuarios}
                            </tbody>
                        </Table>

                        <div className="page-buttons">
                            <Button variant="primary" className="mr-2 arrow-buttons" onClick={this.previousPage}>{`<`}</Button>
                            <Button variant="primary" className="ml-2 arrow-buttons" onClick={this.nextPage}>{`>`}</Button>
                        </div>

                    </Col>
                </Row>
            </Container >
        );
    }
}

export default Usuarios;