import React, {Component} from 'react';
import API from '../../assets/utils';

export default class Home extends Component {
    constructor() {
        super()
        this.state = {}
    }

    componentDidMount() {
        API.then(res => {
            console.log(res)
        })
    }
    render(){
        return <div>

        </div>
    }
}

