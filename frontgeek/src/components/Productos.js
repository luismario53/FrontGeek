
import React, { Component } from 'react';
import { Col, Row, Container, Button, Table } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import swal from 'sweetalert2';
import '../static/css/categorias.css';
import sampleProfile from '../static/img/sample-profile.png';
import ModalProductos from './ModalProductos';
import '../static/css/productos.css';
import '../static/css/selected.css';
//

class Productos extends Component {

    modalProducto = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            modulo: 'Productos',
            productos: [],
            page: 1,
            categorias: [],
            totalPages: 0,
            samplePicture: sampleProfile
        };

    }

    getCategorias = () => {
        var headers = {
            "Authorization": this.props.token
        }
        axios.get("http://127.0.0.1:4000/productos/getNames", {
            headers
        }).then(response => {
            this.setState({ categorias: response.data });
        })
    }

    componentDidMount = () => {
        this.getCategorias();
        this.getProductos();
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // searchUserByRol = (e) => {
    //     var rol = this.capitalizeFirstLetter(e.target.value);
    //     if (e.target.value.toLowerCase().length >= 3) {
    //         axios.get(`http://127.0.0.1:4000/categorias/getbyrol/${rol}`)
    //             .then(response => {
    //                 this.setState({ usuarios: response.data });
    //             });
    //     } else if (e.target.value.toLowerCase().length == 0) {
    //         this.getCategories();
    //     }
    // }

    deleteCategory = (id) => {
        var headers = {
            "Authorization": this.props.token
        }
        swal.fire({
            title: 'mmm',
            text: 'Esta seguro que desea eliminar esta categoria?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Okay'
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:4000/productos/delete/${id}`, { headers })
                    .then(response => {
                        switch (response.status) {
                            case 200: {
                                swal.fire({
                                    title: 'Listo',
                                    text: 'Prdocuto eliminado',
                                    icon: 'success',
                                    confirmButtonText: 'Okay'
                                });
                                this.getProductos();
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
                    }).catch(response => {
                        swal.fire({
                            title: 'Ups',
                            text: 'No tienes permisos para hacer esto',
                            icon: 'error',
                            confirmButtonText: 'chale'
                        });
                    });
            }
        });
    }

    getProductos = () => {
        var headers = {
            "Authorization": this.props.token
        }
        axios.get(`http://127.0.0.1:4000/productos/${this.state.page}`, {
            headers
        }).then(response => {
            this.setState({
                productos: response.data.productos,
                totalPages: response.data.size
            });
        });
    }

    guardarProducto = (producto) => {
        var headers = {
            "Authorization": this.props.token
        }
        axios.post("http://127.0.0.1:4000/productos/agregar", {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            imagenes: [],
            precio: producto.precio,
            categoria: producto.categoria
        }, { headers }).then(response => {
            switch (response.status) {
                case 202: {
                    swal.fire({
                        title: 'Error',
                        text: 'El producto ya está registrado',
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    });
                    break;
                }
                case 200: {
                    if (producto.imagenes !== null) {
                        let formData = new FormData();
                        for (let i = 0; i < producto.imagenes.length; i++) {
                            formData.append(
                                `file${i}`,
                                producto.imagenes[i],
                                producto.imagenes[i].name,
                            )
                        }
                        axios.patch(`http://127.0.0.1:4000/productos/upload-image/${response.data._id}`,
                            formData, { headers }).then(response => {
                                if (response.status === 200) {
                                }
                            });
                    }
                    this.getProductos();
                    swal.fire({
                        title: 'Nicesu',
                        text: 'Producto registrado',
                        icon: 'success',
                        confirmButtonText: 'Okay'
                    });
                    this.modalProducto.current.setState({ show: false });
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
        }).catch(response => {
            swal.fire({
                title: 'Ups',
                text: 'No tienes permisos para hacer esto',
                icon: 'error',
                confirmButtonText: 'chale'
            });
        });
    }

    updateProducto = (producto) => {
        var headers = {
            "Authorization": this.props.token
        }
        axios.patch(`http://127.0.0.1:4000/productos/update/${producto.id}`, {
            nombre: producto.nombre,
            descripcion: producto.descripcion
        }, { headers }).then(response => {
            if (producto.imagenes !== null && producto.imagenes !== undefined) {
                let formData = new FormData();
                for (let i = 0; i < producto.imagenes.length; i++) {
                    formData.append(
                        `file${i}`,
                        producto.imagenes[i],
                        producto.imagenes[i].name,
                    )
                }
                axios.patch(`http://127.0.0.1:4000/productos/upload-image/${producto.id}`,
                    formData, { headers }).then(response => {
                        if (response.status === 200) {

                        }
                    });
            }
            this.getProductos();
            swal.fire({
                title: 'Nicesu',
                text: 'Categoría actualizada',
                icon: 'success',
                confirmButtonText: 'Okay'
            });
            this.modalProducto.current.setState({ show: false });
        }).catch(response => {
            swal.fire({
                title: 'Ups',
                text: 'No tienes permisos para hacer esto',
                icon: 'error',
                confirmButtonText: 'chale'
            });
        });
    }

    previousPage = () => {
        var { page } = this.state;
        if (page > 1) {
            this.setState({
                page: page - 1
            }, () => {
                this.getProductos();
            })
        }
    }

    nextPage = () => {
        var { page } = this.state;
        if (page < this.state.totalPages) {
            this.setState({
                page: page + 1
            }, () => {
                this.getProductos();
            })
        }
    }

    render() {

        const { productos } = this.state;
        const listaProductos = productos.map(producto => {
            return (
                <tr key={producto._id}>
                    <td>{producto.categoria.nombre}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.precio}</td>
                    <td><ModalProductos token={this.props.token} categorias={this.state.categorias} button="Editar" imageButton="Cambiar foto" formButton="Actualizar" producto={producto} editarCategoria={this.updateProducto} /></td>
                    <td><Button variant="danger" onClick={() => this.deleteCategory(producto._id)}>Eliminar</Button></td>
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
                        <ModalProductos
                            token={this.props.token}
                            ref={this.modalProducto}
                            categorias={this.state.categorias}
                            button="Agregar"
                            imageButton="Subir foto"
                            formButton="Guardar"
                            guardarCategoria={this.guardarProducto}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive striped bordered hover size="sm" className="tabla-mouse">
                            <thead>
                                <tr>
                                    <th>Categoría</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th colSpan={2}>Opciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyId">
                                {listaProductos}
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

export default Productos;