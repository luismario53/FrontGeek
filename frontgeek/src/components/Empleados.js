
import React, { Component } from 'react';
import { Col, Row, Container, Button, Table } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import swal from 'sweetalert2';
import '../static/css/categorias.css';
import '../static/css/categorias.css';
import '../static/css/selected.css';
import ModalEmpleados from './modalEmpleados';
import Moment from 'moment';

//

class Empleados extends Component {

    modalEmpleado = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            modulo: 'Empleados',
            empleados: [],
            page: 1,
            totalPages: 0
        };
    }

    componentDidMount = () => {
        this.getEmpleados();
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
    //         this.getEmpleados();
    //     }
    // }

    eliminarEmpleado = (id) => {
        const headers = {
            "Authorization": localStorage.getItem("token")
        };
        swal.fire({
            title: 'mmm',
            text: 'Esta seguro que desea eliminar este empleado?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Okay'
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete(`http://127.0.0.1:4000/empleados/delete/${id}`, { headers })
                    .then(response => {
                        switch (response.status) {
                            case 200: {
                                swal.fire({
                                    title: 'Listo',
                                    text: 'Empleadoeliminado',
                                    icon: 'success',
                                    confirmButtonText: 'Okay'
                                });
                                this.getEmpleados();
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

    formatoFecha = (empleados) => {
        let fechas = [];
        for (let i = 0; i < empleados.length; i++) {
            fechas.push(new Moment(empleados[i].fechaNacimiento).format("DD/MM/YYYY"));
            empleados[i].fechaNacimiento = fechas[i];
        }
        return empleados;
    }

    getEmpleados = () => {
        axios.get(`http://127.0.0.1:4000/empleados/${this.state.page}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }).then(response => {
            var emp = this.formatoFecha(response.data.empleados);
            if (emp.length > 0) {
                this.setState({
                    empleados: emp,
                    totalPages: response.data.size
                });
            }
        });
    }

    saveEmpleado = (empleado) => {
        const headers = {
            "Authorization": localStorage.getItem("token")
        };
        axios.post("http://127.0.0.1:4000/empleados/agregar", {
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            fechaNacimiento: empleado.fechaNacimiento,
            direccion: empleado.direccion,
            telefono: empleado.telefono,
            horario: empleado.horario,
            imagen: "default"
        }, { headers }).then(response => {
            switch (response.status) {
                case 202: {
                    swal.fire({
                        title: 'Error',
                        text: 'El empleado ya está registrado',
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    });
                    break;
                }
                case 200: {
                    if (empleado.imagen !== null) {
                        const formData = new FormData();
                        formData.append(
                            'file0',
                            empleado.imagen,
                            empleado.imagen.name
                        );
                        axios.patch(`http://127.0.0.1:4000/empleados/upload-image/${response.data._id}`,
                            formData, { headers }).then(response => {
                                if (response.status === 200) {
                                    swal.fire({
                                        title: 'Nicesu',
                                        text: 'Empleado registrado',
                                        icon: 'success',
                                        confirmButtonText: 'Okay'
                                    });
                                    this.modalEmpleado.current.setState({ show: false });
                                    this.getEmpleados();
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
        }).catch(response => {
            swal.fire({
                title: 'Ups',
                text: 'No tienes permisos para hacer esto',
                icon: 'error',
                confirmButtonText: 'chale'
            });
        });
    }

    updateCategory = (empleado) => {
        axios.patch(`http://127.0.0.1:4000/categorias/update/${empleado.id}`, {
            nombre: empleado.nombre,
            apellidos: empleado.apellidos,
            fechaNacimiento: empleado.fechaNacimiento,
            direccion: empleado.direccion,
            telefono: empleado.telefono,
            horario: empleado.horario,
        }).then(response => {
            if (empleado.imagen !== null && empleado.imagen !== undefined) {
                const formData = new FormData();
                formData.append(
                    'file0',
                    empleado.imagen,
                    empleado.imagen.name
                );
                axios.patch(`http://127.0.0.1:4000/empleados/upload-image/${empleado.id}`,
                    formData).then(response => {
                        if (response.status === 200) {

                        }
                    });
            }
            this.getEmpleados();
            swal.fire({
                title: 'Nicesu',
                text: 'Empleado actualizado',
                icon: 'success',
                confirmButtonText: 'Okay'
            });
            this.modalEmpleado.current.setState({ show: false });
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
                this.getEmpleados();
            })
        }
    }

    nextPage = () => {
        var { page } = this.state;
        if (page < this.state.totalPages) {
            this.setState({
                page: page + 1
            }, () => {
                this.getEmpleados();
            })
        }
    }

    render() {

        const { empleados } = this.state;
        const listaEmpleados = empleados.map(empleado => {
            return (
                <tr key={empleado._id}>
                    <td>{empleado.nombre}</td>
                    <td>{empleado.apellidos}</td>
                    <td>{empleado.fechaNacimiento}</td>
                    <td>{empleado.direccion}</td>
                    <td>{empleado.telefono}</td>
                    <td>{empleado.horario}</td>
                    <td><ModalEmpleados button="Editar" imageButton="Cambiar foto" formButton="Actualizar" empleado={empleado} /></td>
                    <td><Button variant="danger" onClick={() => this.eliminarEmpleado(empleado._id)}>Eliminar</Button></td>
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
                        <ModalEmpleados
                            ref={this.modalEmpleado}
                            button="Agregar"
                            imageButton="Subir foto"
                            formButton="Guardar"
                            guardarCategoria={this.saveEmpleado}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table responsive striped bordered hover size="sm" className="tabla-mouse">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellidos</th>
                                    <th>Fecha de nacimiento</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Horario</th>
                                    <th colSpan={2}>Opciones</th>
                                </tr>
                            </thead>
                            <tbody id="tbodyId">
                                {listaEmpleados}
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

export default Empleados;