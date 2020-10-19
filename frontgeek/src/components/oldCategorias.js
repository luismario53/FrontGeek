import Axios from 'axios';
import React, { Component } from 'react';
import { Form, Col, Row, Container, Button, Table, InputGroup } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import swal from 'sweetalert2';
import '../static/css/categorias.css';
import sampleProfile from '../static/img/sample-profile.png';
//

class Categorias extends Component {

    nombreRef = React.createRef();
    descripcionRef = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            nombre: '',
            descripcion: '',
            categorias: [],
            selectedFile: null,
            page: 1,
            totalPages: 0,
            samplePicture: sampleProfile
        };

    }

    changeState = () => {
        this.setState({
            nombre: this.nombreRef.current.value,
            descripcion: this.descripcionRef.current.value,
        });

    }

    changeStateImagen = (e) => {
        this.setState({
            samplePicture: URL.createObjectURL(e.target.files[0]),
            selectedFile: e.target.files[0]
        });

    }

    componentDidMount = () => {
        this.getCategories();
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    searchUserByRol = (e) => {
        var rol = this.capitalizeFirstLetter(e.target.value);
        if (e.target.value.toLowerCase().length >= 3) {
            axios.get(`http://127.0.0.1:4000/usuarios/getbyrol/${rol}`)
                .then(response => {
                    this.setState({ usuarios: response.data });
                });
        } else if (e.target.value.toLowerCase().length == 0) {
            this.getCategories();
        }
    }

    deleteUser = (id) => {
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
                        this.getCategories();
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

    getCategories = () => {
        axios.get(`http://127.0.0.1:4000/usuarios/get/${this.state.page}`)
            .then(response => {
                // if (response.data.length > 0) {
                this.setState({
                    usuarios: response.data.users,
                    totalPages: response.data.size
                });
                // }
            });
    }

    saveCategory = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            axios.post("http://127.0.0.1:4000/categorias/agregar", {
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                imagen: "default"
            }).then(response => {
                switch (response.status) {
                    case 202: {
                        swal.fire({
                            title: 'Error',
                            text: 'La categoría ya está registrado',
                            icon: 'error',
                            confirmButtonText: 'Okay'
                        });
                        break;
                    }
                    case 200: {
                        if (this.state.selectedFile !== null) {
                            const formData = new FormData();
                            formData.append(
                                'file0',
                                this.state.selectedFile,
                                this.state.selectedFile.name
                            );
                            axios.patch(`http://127.0.0.1:4000/categorias/upload-image/${this.state.nombre}`,
                                formData).then(response => {
                                    if (response.status === 200) {
                                        swal.fire({
                                            title: 'Nicesu',
                                            text: 'Categoría registrada',
                                            icon: 'success',
                                            confirmButtonText: 'Okay'
                                        }).then(result => {
                                            if (result) {
                                                this.clearForm();
                                            }
                                        });
                                        this.getCategories();
                                    }
                                });
                        }
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
        this.setState({
            correo: "",
            rol: "",
            samplePicture: sampleProfile
        })
        document.getElementById('formUsuarios').reset();
    }

    editUser = (usuario) => {
        this.setState({
            correo: usuario.correo,
            rol: usuario.rol
        });
        // if (this.state.text === "Editar") {
        //     this.setState({
        //         editable: true,
        //         cancelarBoton: false,
        //         text: "Guardar"
        //     }, () => {

        //     })
        // } else {
        //     this.setState({
        //         editable: false,
        //         cancelarBoton: true,
        //         text: "Editar"
        //     }, () => {

        //     })
        // }
    }

    cancelarEditar = (id) => {
        this.setState({
            editable: false,
            cancelarBoton: true,
            text: "Editar"
        }, () => {

        })
    }

    previousPage = () => {
        var { page } = this.state;
        if (page > 1) {
            this.setState({
                page: page - 1
            }, () => {
                this.getCategories();
            })
        }
    }

    nextPage = () => {
        var { page } = this.state;
        if (page < this.state.totalPages) {
            this.setState({
                page: page + 1
            }, () => {
                this.getCategories();
            })
        }
    }

    render() {
        // const { usuarios } = this.state;
        // const listaUsuarios = usuarios.map(usuario => {
        //     return (
        //         <tr key={usuario._id}>
        //             <td>{usuario.correo}</td>
        //             <td>{usuario.rol}</td>
        //             <td>********</td>
        //             <td><Button variant="info" onClick={() => this.editUser(usuario)}>Editar</Button></td>
        //             <td><Button variant="danger" onClick={() => this.deleteUser(usuario._id)}>Eliminar</Button></td>
        //         </tr>
        //     );
        // });

        return (
            <Container className="container-usuarios">
                <Row xs={1} md={1} lg={2} xl={2} className="mt-3 col-12 ml-1">
                    <Col>
                        <Form onSubmit={this.saveCategory} id="formUsuarios">
                            <Form.Group>
                                <Form.Control type="text" placeholder="Categoría" name="nombre" ref={this.nombreRef} onChange={this.changeState} value={this.state.nombre}></Form.Control>
                                {this.validator.message('string', this.state.nombre, 'required|alpha_space')}
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="text" placeholder="Descripción" name="descripcion" ref={this.descripcionRef} onChange={this.changeState} value={this.state.descripcion}></Form.Control>
                                {this.validator.message('string', this.state.descripcion, 'required|alpha_num_space')}
                            </Form.Group>
                            <Form.Group>
                                <img src={this.state.samplePicture} className="sample-picture"></img>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control type="file" name="imagenCategoria" ref={this.rolRef} onChange={this.changeStateImagen}></Form.Control>
                                {/* {this.validator.message('imagenCategoria', this.state.rol)} */}
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Button variant="warning" onClick={this.clearForm}>Limpiar campos</Button>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Button type="submit" variant="success">Registrar</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3">
                            <Form.Control placeholder="Buscar usuario" onKeyUp={this.searchUserByRol}></Form.Control>
                        </InputGroup>
                        <Table responsive striped bordered hover size="sm" className="tabla-mouse">
                            <thead>
                                <tr>
                                    <th lg={2}>Nombre</th>
                                    <th lg={5}>Descripción</th>
                                    <th lg={2}># productos</th>
                                    <th colSpan={2} lg={3}>Opciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyId">
                                {/* {listaUsuarios} */}
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

export default Categorias;