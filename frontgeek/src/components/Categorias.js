import Axios from 'axios';
import React, { Component } from 'react';
import { Form, Col, Row, Container, Button, Table, InputGroup } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import swal from 'sweetalert2';
import '../static/css/categorias.css';
import ModalCategorias from './ModalCategorias';
import '../static/css/categorias.css';
import '../static/css/selected.css';
//

class Categorias extends Component {

    modalCategoria = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            modulo: 'Categorías',
            categorias: [],
            page: 1,
            totalPages: 0
        };
    }

    componentDidMount = () =>{
        this.getCategories();
    }

    // changeState = () => {
    //     this.setState({
    //         nombre: this.nombreRef.current.value,
    //         descripcion: this.descripcionRef.current.value,
    //     });

    // }

    // clearForm = () => {
    //     this.setState({
    //         correo: "",
    //         rol: "",
    //         samplePicture: sampleProfile
    //     })
    //     document.getElementById('formUsuarios').reset();
    // }

    // changeStateImagen = (e) => {
    //     this.setState({
    //         samplePicture: URL.createObjectURL(e.target.files[0]),
    //         selectedFile: e.target.files[0]
    //     });

    // }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    searchUserByRol = (e) => {
        var rol = this.capitalizeFirstLetter(e.target.value);
        if (e.target.value.toLowerCase().length >= 3) {
            axios.get(`http://127.0.0.1:4000/categorias/getbyrol/${rol}`)
                .then(response => {
                    this.setState({ usuarios: response.data });
                });
        } else if (e.target.value.toLowerCase().length == 0) {
            this.getCategories();
        }
    }

    deleteCategory = (id, qty) => {
        if (qty > 0) {
            swal.fire({
                title: 'Ups',
                text: 'No puede eliminar una categoría si tiene productos.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
        } else {
            swal.fire({
                title: 'mmm',
                text: 'Esta seguro que desea eliminar esta categoria?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Okay'
            }).then(result => {
                if (result.isConfirmed) {
                    axios.delete(`http://127.0.0.1:4000/categorias/delete/${id}`)
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
            });

        }
    }

    getCategories = () => {
        axios.get(`http://127.0.0.1:4000/categorias/${this.state.page}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            // if (response.data.length > 0) {
            this.setState({
                categorias: response.data.categories,
                totalPages: response.data.size
            });
            // }
        });
    }

    saveCategory = (categoria) => {
        axios.post("http://127.0.0.1:4000/categorias/agregar", {
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            imagen: "default",
            productos: []
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
                    if (categoria.imagen !== null) {
                        const formData = new FormData();
                        formData.append(
                            'file0',
                            categoria.imagen,
                            categoria.imagen.name
                        );
                        axios.patch(`http://127.0.0.1:4000/categorias/upload-image/${response.data._id}`,
                            formData).then(response => {
                                if (response.status === 200) {
                                    swal.fire({
                                        title: 'Nicesu',
                                        text: 'Categoría registrada',
                                        icon: 'success',
                                        confirmButtonText: 'Okay'
                                    });
                                    this.modalCategoria.current.setState({ show: false });
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
    }

    updateCategory = (categoria) => {
        axios.patch(`http://127.0.0.1:4000/categorias/update/${categoria.id}`, {
            nombre: categoria.nombre,
            descripcion: categoria.descripcion
        }).then(response => {
            if (categoria.imagen !== null && categoria.imagen !== undefined) {
                const formData = new FormData();
                formData.append(
                    'file0',
                    categoria.imagen,
                    categoria.imagen.name
                );
                axios.patch(`http://127.0.0.1:4000/categorias/upload-image/${categoria.id}`,
                    formData).then(response => {
                        if (response.status === 200) {

                        }
                    });
            }
            this.getCategories();
            swal.fire({
                title: 'Nicesu',
                text: 'Categoría actualizada',
                icon: 'success',
                confirmButtonText: 'Okay'
            }).then(result => {
                if (result) {
                    this.modalCategoria.current.setState({ show: false });
                }
            });
        });
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

        const { categorias } = this.state;
        const listaCategorias = categorias.map(categoria => {
            return (
                <tr key={categoria._id}>
                    <td>{categoria.nombre}</td>
                    <td>{categoria.descripcion}</td>
                    <td>{categoria.productos.length}</td>
                    <td><ModalCategorias button="Editar" imageButton="Cambiar foto" formButton="Actualizar" categoria={categoria} editarCategoria={this.updateCategory} /></td>
                    <td><Button variant="danger" onClick={() => this.deleteCategory(categoria._id, categoria.productos.length)}>Eliminar</Button></td>
                </tr>
            );
        });

        return (
            <Container className="mt-4">
                <Row lg={1} md={1} className="mb-4">
                    <Col>
                        <h1 className="label-categoria">{this.state.modulo}</h1>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col>
                        <ModalCategorias
                            ref={this.modalCategoria}
                            button="Agregar"
                            imageButton="Subir foto"
                            formButton="Guardar"
                            guardarCategoria={this.saveCategory}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
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
                                {listaCategorias}
                            </tbody>
                        </Table>
                        <div className="page-buttons">
                            <Button variant="primary" className="mr-2 arrow-buttons" onClick={this.previousPage}>{`<`}</Button>
                            <Button variant="primary" className="ml-2 arrow-buttons" onClick={this.nextPage}>{`>`}</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

        );
    }
}

export default Categorias;