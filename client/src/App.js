import React, {Component} from 'react';
import logo from './img/react.svg'
import './App.scss';
import logo2 from './img/sokra.png';

class App extends Component {
    render() {
        return (
            <div className="App">
                <p>Hello</p>
                <img width="100" height="100" src={logo} alt=""/>
                <img width="100" height="100" src={logo2} alt=""/>
            </div>
    );
    }
}

export default App;
