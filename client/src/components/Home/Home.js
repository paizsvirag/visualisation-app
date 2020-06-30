import React, {Component} from 'react';
import API from '../../assets/utils';
import Draggable from 'react-draggable'; 
import Plot from 'react-plotly.js';
import './home.scss'

export default class Home extends Component {
    constructor() {
        super()
        this.state = {
            activeDrags: 0,
            deltaPosition: {
              x: 0, y: 0
            },
            controlledPosition: {
              x: -400, y: 200
            },
            covidData: {},
            country: 'Afghanistan',
            province: 'Other'
        }
    }

    handleDrag = (e, ui) => {
        const {x, y} = this.state.deltaPosition;
        this.setState({
          deltaPosition: {
            x: x + ui.deltaX,
            y: y + ui.deltaY,
          }
        });
    };

    handleCountrySelection = (event) => {
        let firstProvince = Object.keys(this.state.covidData[event.target.value])[0]
        this.setState({
            country: event.target.value,
            province: firstProvince 
        });
    }

    handleProvinceSelection = (event) => {
            this.setState({
                province: event.target.value 
            });
    }

    onStart = () => {
        this.setState({
            activeDrags: this.state.activeDrags + this.state.activeDrags
        });
    };
    
    onStop = () => {
        this.setState({
            activeDrags: this.state.activeDrags - this.state.activeDrags
        });
    };

    componentDidMount() {
        API.then(res => {
            this.setState({
                covidData: res.data.allData.time_series
            })
        })
    }
    render(){
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
        const {country, covidData, province} = this.state;
        console.log(covidData)
        if(Object.keys(covidData).length === 0) {
            return <div></div>
        }
        return <div>
            <Draggable handle="strong" {...dragHandlers}>
                <div className="box no-cursor">
                <strong className="cursor"><div>Drag here</div></strong>
                <div>
                    <select value={country} onChange={e => this.handleCountrySelection(e)}>
                    {Object.keys(covidData).map((element) => {
                        return <option value={element}>{element}</option>
                    })}
                    </select>
                    {country && covidData[country] ? (<select value={province} onChange={e => this.handleProvinceSelection(e)}>
                        {Object.keys(covidData[country]).map((element) => {
                        return <option value={element}>{element}</option>
                    })}
                        </select>) : <div></div>
                    }
                </div>
                <Plot
                    data={[
                    {
                        x: Object.keys(covidData[country][province]['confirmed']),
                        y: Object.values(covidData[country][province]['confirmed']),
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Confimed cases',
                        marker: {color: 'red'},
                    },
                    {
                        x: Object.keys(covidData[country][province]['deaths']),
                        y: Object.values(covidData[country][province]['deaths']),
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Deaths',
                        marker: {color: 'blue'},
                    },
                    {
                        x: Object.keys(covidData[country][province]['recovered']),
                        y: Object.values(covidData[country][province]['recovered']),
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Recovered',
                        marker: {color: 'green'},
                    },
                    ]}
                    layout={ {width: 1000, height: 600, title: 'Covid19 data'} }
                />
                </div>
            </Draggable>
        </div>
    }
}

