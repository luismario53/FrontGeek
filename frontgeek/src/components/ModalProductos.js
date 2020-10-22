import React, { Component } from 'react';
import { Button, Form, Container, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import swal from 'sweetalert2';
import uploadImage from '../static/img/upload-picture.png';
import SimpleReactValidator from 'simple-react-validator';
import '../static/css/modalProductos.css';
import CategoriaSelect from 'react-select-search';

class ModalProductos extends Component {

    nombreRef = React.createRef();
    descripcionRef = React.createRef();
    precioRef = React.createRef();
    categoriaRef = React.createRef();

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
            precio: 0,
            categoria: '',
            categorias: [],
            selectedFiles: null,
            samplePicture: [
                uploadImage,
                uploadImage,
                uploadImage
            ],
            show: false,
            text: this.props.button,
            formButton: this.props.formButton
        };
    }

    changeState = () => {
        this.setState({
            nombre: this.nombreRef.current.value,
            descripcion: this.descripcionRef.current.value,
            precio: this.precioRef.current.value
        });

    }

    handleChangeCategoria = (categoria) => {
        this.setState({ categoria: categoria });
    }

    changeStateImagen = (e) => {
        if (e.target.files.length > 3) {
            swal.fire({
                title: 'Ups',
                text: 'Solo puede seleccionar maximo 3 imagenes',
                icon: 'warning',
                confirmButtonText: 'Okay'
            });
        } else {
            var imagenes = [];
            for (let i = 0; i < e.target.files.length; i++) {
                imagenes[i] = URL.createObjectURL(e.target.files[i])
            }
            while (imagenes.length < 3) {
                imagenes.push(uploadImage);
            }
            this.setState({
                samplePicture: imagenes,
                selectedFiles: e.target.files
            });
        }
    }

    saveCategory = (e) => {
        e.preventDefault();
        if (this.state.categoria && this.validator.allValid() && (this.state.image || this.state.selectedFiles.length > 0)) {
            var producto = {
                id: this.state.id,
                nombre: this.state.nombre,
                descripcion: this.state.descripcion,
                precio: this.state.precio,
                categoria: this.state.categoria,
                imagenes: this.state.selectedFiles
            }
            if (this.state.formButton === "Actualizar") {
                this.props.editarCategoria(producto);
            } else {
                this.props.guardarCategoria(producto)
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

    setCategorias = () => {
        var list = this.props.categorias;
        this.setState({
            categorias: list
        });

    }

    handleModal = (show) => {
        var headers = {
            "Authorization": this.props.token
        }
        this.setState({ show: show }, () => {
            if (show) {
                this.setCategorias();
                if (this.props.producto !== undefined) {
                    axios.get(`http://127.0.0.1:4000/productos/get-images/${this.props.producto._id}`, { headers })
                        .then(response => {
                            this.setState({
                                id: this.props.producto._id,
                                nombre: this.props.producto.nombre,
                                descripcion: this.props.producto.descripcion,
                                precio: this.props.producto.precio,
                                categoria: this.props.producto.categoria._id,
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
            precio: 0,
            categoria: "",
            samplePicture: [
                uploadImage,
                uploadImage,
                uploadImage
            ],
            image: false
        })
        document.getElementById('formUsuarios').reset();
    }

    handleClick = (e) => {
        this.hiddenFileInputRef.current.click();
    }

    camposNumericos = (e) => {
        if (e.which !== 8 && e.which !== 0 && e.which < 48 || e.which > 57) {
            e.preventDefault();
        }
    }

    render() {

        return (
            <>
                <Button variant="primary" onClick={() => this.handleModal(true)}>{this.state.text}</Button>

                <Modal show={this.state.show} onHide={() => this.handleModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Registrar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Form onSubmit={this.saveCategory} id="formUsuarios">
                                <Form.Group>
                                    <Form.Control type="text" placeholder="Producto" name="nombre" ref={this.nombreRef} onChange={this.changeState} value={this.state.nombre}></Form.Control>
                                    {this.validator.message('string', this.state.nombre, 'required|alpha_num_space')}
                                </Form.Group>
                                <Form.Group>
                                    <CategoriaSelect
                                        onChange={categoria => this.handleChangeCategoria(categoria)}
                                        options={this.state.categorias}
                                        placeholder="Seleccione categoría"
                                        value={this.state.categoria}
                                        ref={this.categoriaRef}
                                    />
                                    {this.validator.message('string', this.state.categoria, 'required|alpha_num_space')}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control as="textarea" rows={4} placeholder="Descripción" name="descripcion" ref={this.descripcionRef} onChange={this.changeState} value={this.state.descripcion}></Form.Control>
                                    {this.validator.message('string', this.state.descripcion, 'required|string')}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Control type="number" placeholder="Precio" name="precio" ref={this.precioRef} onChange={this.changeState} value={this.state.precio} onKeyPress={this.camposNumericos}></Form.Control>
                                    {this.validator.message('numeric', this.state.precio, 'required|numeric')}
                                </Form.Group>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <img src={this.state.samplePicture[0]} className="sample-picture" />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <img src={this.state.samplePicture[1]} className="sample-picture" />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <img src={this.state.samplePicture[2]} className="sample-picture" />
                                    </Form.Group>
                                </Form.Row>
                                <Form.Group>
                                    <Form.Control style={{ display: 'none' }} accept=".jpg,.png,.jpeg" type="file" name="imagenCategoria" ref={this.hiddenFileInputRef} onChange={this.changeStateImagen} multiple />
                                </Form.Group>
                                <Form.Group>
                                    <center>
                                        <Button type="button" variant="info" onClick={this.handleClick}>{this.props.imageButton}</Button>
                                    </center>
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

export default ModalProductos;