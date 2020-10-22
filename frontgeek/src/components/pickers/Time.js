import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { Button } from 'react-bootstrap';
import '../../static/css/fecha.css';
import TimePicker from 'react-time-picker';

class Time extends Component {

    state = {
        value: this.props.horaEntrada,
    };

    componentDidMount = () => {

    }

    handleChange = time => {
        this.setState({ value: time });
        this.obtenerTime(time);
    };

    obtenerTime = (time) => {
        this.props.obtenerHora(time);
    }

    render() {
        return (
            <div>
                {!this.props.disabled &&
                    <TimePicker
                        onChange={this.handleChange}
                        value={this.state.value}
                        minTime={this.props.horaEntrada}
                        disableClock={true}
                    />
                }
            </div>
        );
    }
}

export default Time;