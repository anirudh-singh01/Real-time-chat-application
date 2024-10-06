import { ChakraProvider, Box, Heading, Container } from "@chakra-ui/react";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" p={5}>
        <Box p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
          <Heading as="h1" mb={6} textAlign="center">
            Real-Time Chat
          </Heading>
          <ChatBox />
        </Box>
      </Container>
    </ChakraProvider>
  );
}

export default App;
