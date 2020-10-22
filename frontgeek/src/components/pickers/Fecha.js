import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { Button } from 'react-bootstrap';
import '../../static/css/fecha.css';

class Fecha extends Component {

    state = {
        startDate: new Date(),
        maxDate: new Date()
    };

    componentDidMount = () => {
        var tomorrow = new Date();
        tomorrow.setDate(new Date().getDate());
        this.setState({ maxDate: tomorrow });
    }

    handleChange = date => {
        this.setState({ startDate: date });
    };

    obtenerDate = (date) => {
        this.props.obtenerFecha(date);
    }

    render() {

        const FechaForm = ({ value, onClick }) => {
            return (
                <Button disabled={this.props.fechaStatus} className="btn-fecha" onClick={onClick} variant='info' block size="lg">
                    {value}
                </Button>
            );
        }

        return (
            <div>
                <DatePicker
                    locale={es}
                    dateFormat='d/MM/yyyy'
                    onSelect={this.obtenerDate}
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    // customInput={<FechaForm />}
                    maxDate={this.state.maxDate}
                />
            </div>
        );
    }
}

export default Fecha;