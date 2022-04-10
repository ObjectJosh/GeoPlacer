import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Chat({ socket, username, room, setOnlineUsers }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [show, setShow] = useState(true);


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on('count', (count) => {
      console.log(count)
      setOnlineUsers(count);
    });
  }, [socket]);

  // function handleToggle() {
  //   set
  // }

  const styles = {
    container: {
      position: 'absolute',
    }
  }

  return (
    <Box className="chat-window" sx={{ pb: '1rem' }}>
      <div className="chat-header" onClick={() => setShow(!show)}>
        <p>World Chat
          {show ? <KeyboardArrowDownIcon sx={{ position: 'absolute', transform: 'translate(4rem, 0.5rem)' }}/>
            : <KeyboardArrowUpIcon sx={{ position: 'absolute', transform: 'translate(4rem, 0.5rem)' }}/>
          }
        </p>        
      </div>
      {show &&
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>

      </div>}

      <Box className="chat-footer" sx={{ backgroundColor: 'white' }}>
        <input
          type="text"
          value={currentMessage}
          placeholder="Type something..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}><SendIcon /></button>
      </Box>

      <div className="user_count">
      </div>

    </Box>
  );
}

export default Chat;