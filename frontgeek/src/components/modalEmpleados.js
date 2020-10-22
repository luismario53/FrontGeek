import React, { Component } from 'react';
import { Button, Form, Container, Col, Modal, Row, FormLabel } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert2';
import sampleProfile from '../static/img/sample-profile.png';
import SimpleReactValidator from 'simple-react-validator';
import '../static/css/modalEmpleados.css';
import Fecha from './pickers/Fecha';
import Time from './pickers/Time';
import Moment from 'moment';

class ModalEmpleados extends Component {



    nombreRef = React.createRef();
    apellidosRef = React.createRef();
    direccionRef = React.createRef();
    telefonoRef = React.createRef();
    imagenRef = React.createRef();

    hiddenFileInputRef = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            disabled: true,
            image: false,
            nombre: '',
            apellidos: '',
            fechaNacimiento: new Date(),
            direccion: '',
            telefono: '',
            imagen: '',
            horario: '',
            entrada: '',
            salida: '',
            selectedFile: null,
            samplePicture: sampleProfile,
            show: false,
            text: this.props.button,
            formButton: this.props.formButton
        };
    }

    fechaNacimiento = (fechaNacimiento) => {
        this.setState({ fechaNacimiento: fechaNacimiento });
    }

    parseHora = () => {
        var horario = this.state.horario.split(/:| |-/);
        var horaEntrada = parseInt(horario[0]);
        var minutosEntrada = horario[1];
        var horaSalida = parseInt(horario[4]);
        var minutosSalida = horario[5];
        var entrada = horaEntrada + ":" + minutosEntrada;
        var salida = horaSalida + ":" + minutosSalida;
        this.setState({
            entrada: entrada,
            salida: salida
        });
        // var auxEntrada = Moment().set('hour', horaEntrada).set('minute', minutosEntrada);
        // var auxSalida = Moment().set('hour', horaSalida).set('minute', minutosSalida);
    }

    horaEntrada = (hora) => {
        this.setState({
            entrada: hora,
            disabled: false
        });
    }

    horaSalida = (hora) => {
        this.setState({ horario: this.state.entrada + " - " + hora }, () => {
            //this.parseHora();
        });
    }

    changeState = () => {
        this.setState({
            nombre: this.nombreRef.current.value,
            apellidos: this.apellidosRef.current.value,
            direccion: this.direccionRef.current.value,
            telefono: this.telefonoRef.current.value,
        });

    }

    changeStateImagen = (e) => {
        this.setState({
            samplePicture: URL.createObjectURL(e.target.files[0]),
            selectedFile: e.target.files[0]
        });

    }

    realizarCambios = (e) => {
        e.preventDefault();
        if (this.validator.allValid() && (this.state.image || this.state.selectedFile)) {
            var empleado = {
                id: this.state.id,
                nombre: this.state.nombre,
                apellidos: this.state.apellidos,
                fechaNacimiento: this.state.fechaNacimiento,
                direccion: this.state.direccion,
                telefono: this.state.telefono,
                horario: this.state.horario,
                imagen: this.state.selectedFile
            }
            console.log(empleado)
            if (this.state.formButton === "Actualizar") {
                this.props.editarCategoria(empleado);
            } else {
                this.props.guardarCategoria(empleado)
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            swal.fire({
                title: 'Ups',
                text: 'Debe llenar todos los campos',
                icon: 'warning',
                confirmButtonText: 'Okay'
            });
        }
    }

    handleModal = (show) => {
        this.setState({ show: show }, () => {
            if (show) {
                if (this.props.empleado !== undefined) {
                    //console.log(this.props.empleado)
                    const headers = {
                        "Authorization": localStorage.getItem("token")
                    };
                    axios.get(`http://127.0.0.1:4000/empleados/get-images/${this.props.empleado._id}`, { headers })
                        .then(response => {
                            //console.log(response.data)
                            this.setState({
                                id: this.props.empleado._id,
                                nombre: this.props.empleado.nombre,
                                apellidos: this.props.empleado.apellidos,
                                fechaNacimiento: this.props.empleado.fechaNacimiento,
                                direccion: this.props.empleado.direccion,
                                telefono: this.props.empleado.telefono,
                                horario: this.props.empleado.horario,
                                samplePicture: response.data,
                                image: true
                            }, () => {
                                this.parseHora();
                            });
                        });
                }
            } else {
                this.clearForm();
            }

        });
    }

    clearForm = () => {
        this.setState({
            nombre: "",
            apellidos: '',
            fechaNacimiento: new Date(),
            direccion: '',
            telefono: '',
            imagen: '',
            horario: '',
            samplePicture: sampleProfile,
            image: false
        })
        document.getElementById('formUsuarios').reset();
    }

    handleClick = (e) => {
        this.hiddenFileInputRef.current.click();
    }

    render() {

        return (
            <>
                <Button variant="primary" onClick={() => this.handleModal(true)}>{this.state.text}</Button>

                <Modal show={this.state.show} onHide={() => this.handleModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar Empleados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form onSubmit={this.realizarCambios} id="formUsuarios">
                                <Form.Group>
                                    <FormLabel>Nombre</FormLabel>
                                    <Form.Control type="text" placeholder="Nombre" name="nombre" ref={this.nombreRef} onChange={this.changeState} value={this.state.nombre}></Form.Control>
                                    {this.validator.message('string', this.state.nombre, 'required|alpha_space')}
                                </Form.Group>
                                <Form.Group>
                                    <FormLabel>Apellidos</FormLabel>
                                    <Form.Control type="text" placeholder="Apellidos" name="apellidos" ref={this.apellidosRef} onChange={this.changeState} value={this.state.apellidos}></Form.Control>
                                    {this.validator.message('string', this.state.descripcion, 'required|alpha_space')}
                                </Form.Group>
                                <Form.Group>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    {this.state.formButton === "Actualizar"
                                        ? <Form.Control disabled value={this.state.fechaNacimiento}></Form.Control>
                                        : <Fecha
                                            obtenerFecha={this.fechaNacimiento}
                                        />
                                    }
                                </Form.Group>
                                <Form.Group>
                                    <FormLabel>Dirección</FormLabel>
                                    <Form.Control type="text" placeholder="Dirección" name="direccion" ref={this.direccionRef} onChange={this.changeState} value={this.state.direccion}></Form.Control>
                                    {this.validator.message('string', this.state.direccion, 'required|string')}
                                </Form.Group>
                                <Form.Group>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Form.Control type="number" placeholder="Teléfono" name="telefono" ref={this.telefonoRef} onChange={this.changeState} value={this.state.telefono}></Form.Control>
                                    {this.validator.message('numeric', this.state.telefono, 'required|numeric')}
                                </Form.Group>
                                {this.state.formButton === "Guardar"
                                    ? <Form.Row>
                                        <Form.Group as={Col}>
                                            <FormLabel>Hora Entrada</FormLabel>
                                            <Time
                                                valueEntrada={this.state.entrada}
                                                obtenerHora={this.horaEntrada}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <FormLabel>Hora Salida</FormLabel>
                                            <Time
                                                valueSalida={this.state.salida}
                                                disabled={this.state.disabled}
                                                horaEntrada={this.state.entrada}
                                                obtenerHora={this.horaSalida}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    : <Form.Row>
                                        <Form.Group as={Col}>
                                            <Form.Label>Hora Entrada</Form.Label>
                                            <Form.Control disabled value={this.state.entrada} />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Hora Salida</Form.Label>
                                            <Form.Control disabled value={this.state.salida} />
                                        </Form.Group>
                                    </Form.Row>
                                }
                                <Form.Group>
                                    <img src={this.state.samplePicture} className="sample-picture-empleado"></img>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control style={{ display: 'none' }} accept=".jpg,.png,.jpeg" type="file" name="imagen" ref={this.hiddenFileInputRef} onChange={this.changeStateImagen}></Form.Control>
                                    <Button type="button" variant="info" onClick={this.handleClick}>{this.props.imageButton}</Button>
                                </Form.Group>
                                <hr />
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Button variant="warning" onClick={this.clearForm}>Limpiar campos</Button>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mr-0">
                                        <Button type="submit" variant="success">{this.state.formButton}</Button>
                                    </Form.Group>
                                </Form.Row>
                            </Form>
                        </Container>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default ModalEmpleados;