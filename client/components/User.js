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
  TextField,
} from '@mui/material';
import { useUser } from '../UserProvider';

import { findUser, addUser } from '../api/user';

const PATH = 'https://geoplacer.herokuapp.com:3000';
// const PATH = "http://localhost:3001";

const socket = io.connect(PATH);
// const socket = require("socket.io-client")(PATH);
// socket.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });

function User({ setOnlineUsers }) {
//   console.log("HEERERRER")
// console.log(socket)
  const [showChat, setShowChat] = useState(false);
  const { currentUser, setCurrentUser, displayChat, setDisplayChat } = useUser();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState('');
  const [room, setRoom] = useState("");

  const joinChat = () => {
    async function checkUser() {
      let user = await findUser(username);
      /* If no user found, make new user */
      if (!user || (user && user.length === 0)) {
        addUser({
          id: username,
          pin: pin,
          placed: 0
        });
      } else { /* User found. Set user */
        console.log('Welcome back, ' + user[0].id);
        setCurrentUser(user[0]);
      }
    }
    if (username !== "" && pin !== "" && room !== "") {
      checkUser();
      setRoom("1");
      socket.emit("join_chat", room);
      setShowChat(true);
      setDisplayChat(true);
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
      backgroundColor: (username == "" || pin?.length != 4 || room == "" ? '#d9d9d9' : '#43a047'),
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
        <Box className="joinChatContainer" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20rem', pb: '4rem', backgroundColor: 'none', borderRadius: '2rem', border: 2, mt: '3rem' }}>
          <h3>Log in</h3>
          <input
            type="text"
            placeholder="Username"
            onChange={(event) => {
              setUsername(event.target.value);
              setRoom("1");
            }}
            style={{ paddingLeft: '1rem' }}
            value={username}
            maxLength={10}
          />
          <input
            type="password"
            placeholder="PIN"
            onChange={(e) => {
              const re = /^[0-9\b]+$/;
              if (e.target.value === '' || re.test(e.target.value)) {
                setPin(e.target.value);
                setRoom("1");
              }
            }}
            style={{ paddingLeft: '1rem' }}
            value={pin}
            maxLength={4}
          />
          <Button sx={styles.button} disabled={username == "" || pin.length != 4 || room == ""} onClick={joinChat}>Start Placing</Button>
        </Box>
      ) : (
        <Chat socket={socket} username={username} room={room} setOnlineUsers={setOnlineUsers} />        
      )}
    </Box>
  );
}

export default User;