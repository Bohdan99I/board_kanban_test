import React from 'react';
import { ChakraProvider, Container, VStack } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './store';
import SearchBar from './components/SearchBar';
import RepoHeader from './components/RepoHeader';
import KanbanBoard from './components/KanbanBoard';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={6} align="stretch">
            <SearchBar />
            <RepoHeader />
            <KanbanBoard />
          </VStack>
        </Container>
      </ChakraProvider>
    </Provider>
  );
}

export default App;