import React, { useState, useEffect } from "react";
import { Box, Input, Button, HStack, VStack, Text, Avatar } from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); //local
//const socket = io("https://real-time-chat-application-8tst.onrender.com"); //deployment

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [avatar, setAvatar] = useState(null); // User's avatar symbol

  useEffect(() => {
    // Get avatar assigned by the server
    socket.on("assignAvatar", (assignedAvatar) => {
      setAvatar(assignedAvatar); // Store the avatar symbol assigned by the server
    });

    // Listen for messages
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("assignAvatar");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        avatar, // Attach this user's avatar to the message
        text: input,
        timestamp: new Date().toLocaleTimeString(),
      };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box h="400px" p={4} borderWidth={1} borderRadius="lg" overflowY="auto">
        {messages.map((msg, index) => (
          <HStack key={index} justify={msg.avatar === avatar ? "flex-start" : "flex-end"}>
            {msg.avatar === avatar && <Avatar name={msg.avatar} />}
            <Box
              bg={msg.avatar === avatar ? "blue.100" : "green.100"}
              p={3}
              borderRadius="lg"
              maxW="70%"
            >
              <Text>{msg.text}</Text>
              <Text fontSize="xs" color="gray.500">{msg.timestamp}</Text>
            </Box>
            {msg.avatar !== avatar && <Avatar name={msg.avatar} />}
          </HStack>
        ))}
      </Box>

      <HStack>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={sendMessage} colorScheme="teal">
          Send
        </Button>
      </HStack>
    </VStack>
  );
};

export default ChatBox;
