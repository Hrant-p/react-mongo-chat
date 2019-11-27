import React, {Component} from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:4000');

class ChatContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: '',
            status: '',
            allMessagesData: '',
            name: '',
            message: ''
        }
    }

    keyPressed = e => {
        if (e.key === 'Enter') {
            socket.emit('input', {
                name: this.state.name,
                message: this.state.message
            });
            e.preventDefault()
        }
    };

    handleStatus = data => {
            if (this.state.status !== data && !this.state.id) {
                    this.setState({
                        id: setTimeout(() => this.setState({
                            status: data
                        }), 2500)
                    })
            }
    };

    componentDidMount() {
        if (socket) {
            console.log('Connected to socket...');
            socket.on('output', data => {
              if (data.length) {
                  this.setState({
                      allMessagesData: data
                  })
              }
            });
            socket.on('status', status => {
                this.handleStatus(status)
            })
        }
    }

    handleChange = ({target: {name, value}}) => {
        this.setState({
            [name]: value
        })
    };



    render() {
        const {allMessagesData} = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-sm-12">
                        <h1 className="text-center">
                            MongoChat
                            <button id="clear" className="btn btn-danger">Clear</button>
                        </h1>
                        <div id="status">

                        </div>
                        <div id="chat">
                            <input
                                type="text"
                                id="username"
                                name="name"
                                className="form-control"
                                placeholder="Enter name..."
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                                <br/>
                                    <div className="card">
                                        <div id="messages" className="card-block" style={{height: '400px'}}>
                                            {JSON.stringify(allMessagesData)}
                                        </div>
                                    </div>
                                    <br/>
                                        <textarea
                                            id="textarea"
                                            name="message"
                                            className="form-control"
                                            placeholder="Enter message..."
                                            onChange={this.handleChange}
                                            onKeyPress={this.keyPressed}
                                            value={this.state.message}
                                        />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatContainer;
