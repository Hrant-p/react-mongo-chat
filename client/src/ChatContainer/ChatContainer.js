import React, { Component } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:4000');

class ChatContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            id: null,
            status: '',
            allMessagesData: [],
            name: '',
            message: ''
        };
    };

    componentDidMount() {
        this.onListenSockets(socket);
    }

    onListenSockets = socket => {
        if (socket) {
            console.log('Connected to socket...');

            socket.on('output', data => {
                    this.setState({ allMessagesData: data })
            });

            socket.on('status', currentStatus => {
                if (this.state.status !== currentStatus && !this.state.id) {
                    this.setState({
                        status: currentStatus,
                        id: setTimeout(this.handleStatusDefault,1500)
                    })
                }
            });

            socket.on('cleared', clearingStatus => {
                if (clearingStatus) {
                    this.setState({
                        name: '',
                        status: 'Cleared messages list',
                        id: setTimeout(this.handleStatusDefault,3000)
                    })
                }
            })
        }
    };

    keyPressed = e => {
        if (e.key === 'Enter') {
            socket.emit('input', {
                name: this.state.name,
                message: this.state.message
            });
            e.preventDefault();
            this.setState({ message: '' })
        }
    };

    handleClick = () => {
        socket.emit('clear');
    };

    handleStatusDefault = () => {
        this.setState({
            status: '',
            id: clearTimeout(this.state.id)
        })
    };

    handleChange = ({target: {name, value}}) => {
        this.setState({
            [name]: value
        })
    };

    render() {
        const { allMessagesData, status, name, message } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-sm-12">
                        <h1 className="text-center">
                            MongoChat
                            <button
                                id="clear"
                                className="btn btn-danger"
                                onClick={this.handleClick}
                            >
                                Clear
                            </button>
                        </h1>
                        <div id="status">
                            {status}
                        </div>
                        <div id="chat">
                            <input
                                type="text"
                                id="username"
                                name="name"
                                className="form-control"
                                placeholder="Enter name..."
                                value={name}
                                onChange={this.handleChange}
                            />
                                <br/>
                                    <div className="card">
                                        <div id="messages" className="card-block" style={{height: '400px'}}>
                                            {allMessagesData.map(item => (
                                                <div
                                                    key={item._id}>
                                                    <b style={{marginLeft: '15px'}}>
                                                        {`${item.name}: `}
                                                    </b>
                                                    {item.message}
                                                </div>
                                            ))}
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
                                            value={message}
                                        />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatContainer;
