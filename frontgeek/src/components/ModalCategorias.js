import React, { Component } from 'react';
import { Button, Form, Container, Col, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert2';
import sampleProfile from '../static/img/sample-profile.png';
import SimpleReactValidator from 'simple-react-validator';
import '../static/css/modalCategorias.css';

class ModalCategorias extends Component {

    nombreRef = React.createRef();
    descripcionRef = React.createRef();

    hiddenFileInputRef = React.createRef();

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator({
            messages: {
                default: 'Debe llenar todos los campos',
            },
        });
        this.state = {
            image: false,
            nombre: '',
            descripcion: '',
            selectedFile: null,
            samplePicture: sampleProfile,
            show: false,
            text: this.props.button,
            formButton: this.props.formButton
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

    saveCategory = (e) => {
        e.preventDefault();
        if (this.validator.allValid() && (this.state.image || this.state.selectedFile)) {
            var categoria = {
                id: this.state.id,
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                imagen: this.state.selectedFile
            }
            if (this.state.formButton === "Actualizar") {
                this.props.editarCategoria(categoria);
            } else {
                this.props.guardarCategoria(categoria)
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
        var headers = {
            "Authorization": this.props.token
        }
        this.setState({ show: show }, () => {
            if (show) {
                if (this.props.categoria !== undefined) {
                    axios.get(`http://127.0.0.1:4000/categorias/get-image/${this.props.categoria._id}`,{headers})
                        .then(response => {
                            this.setState({
                                id: this.props.categoria._id,
                                nombre: this.props.categoria.nombre,
                                descripcion: this.props.categoria.descripcion,
                                samplePicture: response.data,
                                image: true
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
            descripcion: "",
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
                        <Modal.Title>Registrar Categoría</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form onSubmit={this.saveCategory} id="formUsuarios">
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Categoría" name="nombre" ref={this.nombreRef} onChange={this.changeState} value={this.state.nombre}></Form.Control>
                                    {this.validator.message('string', this.state.nombre, 'required|alpha_num_space')}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as="textarea" rows={4} placeholder="Descripción" name="descripcion" ref={this.descripcionRef} onChange={this.changeState} value={this.state.descripcion}></Form.Control>
                                    {this.validator.message('string', this.state.descripcion, 'required|string')}
                                </Form.Group>
                                <Form.Group>
                                    <img src={this.state.samplePicture} className="sample-picture-categoria"></img>
                                </Form.Group>
                                <Form.Group>
                                    {/* <FileUploader /> */}
                                    <Form.Control style={{ display: 'none' }} accept=".jpg,.png,.jpeg" type="file" name="imagenCategoria" ref={this.hiddenFileInputRef} onChange={this.changeStateImagen}></Form.Control>
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

export default ModalCategorias;