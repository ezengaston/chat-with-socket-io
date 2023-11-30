import { React, useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import InfoBar from "../InfoBar/InfoBar";
import Messages from "../Messages/Messages";
import Input from "../Input/Input";
import TextContainer from "../TextContainer/TextContainer";

import "./chat.css";

let socket;

export default function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [existingUser, setExistingUser] = useState(false);
  const [users, setUsers] = useState([]);

  const location = useLocation();
  const ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => setExistingUser(true));

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((PrevMessages) => [...PrevMessages, message]);
    });

    socket.on("roomData", (data) => {
      setUsers(data.users);
    });
  }, []);

  function sendMessage(e) {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  }

  if (existingUser) {
    return (
      <div className="outerContainer">
        <h1 className="userExist">User already exist</h1>
      </div>
    );
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
}
