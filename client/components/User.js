import React, { useState } from 'react';
import "./User.css";
import io from "socket.io-client";
import Chat from "./Chat";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';

const socket = io.connect("http://localhost:3001");

function User({ showChat, setShowChat }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const joinChat = () => {
    if (username !== "" && room !== "") {
      setRoom("1");
      socket.emit("join_chat", room);
      setShowChat(true);
    }
  };

  const styles = {
    button: {
      width: '225px',
      height: '50px',
      margin: '7px',
      border: 'none',
      borderRadius: '5px',
      padding: '5px',
      fontSize: '16px',
      backgroundColor: '#43a047',
      color: '#fff',
      cursor: 'pointer',
    },
    login: {
      // position: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      align: 'top',
      // overflow: 'hidden',
      top: 0,
      backgroundColor: 'none',
      verticalAlign: 'top',
    },
    container: {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'flex-end',
      align: 'right',
      bottom: 10,
      right: 10,
      overflow: 'hidden',
      backgroundColor: 'none',
    }
    
  }

  return (
    <Box className="ChatApp" style={!showChat ? styles.login : styles.container}>
      {!showChat ? (
        <div className="joinChatContainer">

          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
              setRoom("1");
            }}
          />
          <Button sx={styles.button} onClick={joinChat}>Join the Chat</Button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />        
      )}
    </Box>
  );
}

export default User;