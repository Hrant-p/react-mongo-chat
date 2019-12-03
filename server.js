// "use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
//
const app = new express();
app.use(bodyParser.urlencoded({extended:true}));

// -----------------Connect to mongo-------------------------------------------------------------------
mongo.connect('mongodb://127.0.0.1/mongochat',
    { useUnifiedTopology: true },
    function(err, database){
    if(err){
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', function(socket){
        let chat = database
            .db('mongochat')
            .collection('chats');
        // Create function to send status
        let sendStatus = function (s) {
            socket.emit('status', s);
        };

        // Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if(name === '' || message === '') {
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insertOne({
                        name: name,
                        message: message
                    },
                    function(){
                        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
                            if(err){
                                throw err;
                            }

                            // Emit the messages
                            client.emit('output', res);
                        });
                    // client.emit('output', [data]);
                    // Send status
                    sendStatus('Message sent');
                })
            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared', true);
            });
            chat.find().toArray((err, res) => {
                if (err) {
                    throw err
                }
                client.emit('output', [])
            });
        });
    });
});
