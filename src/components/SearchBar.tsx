import React, { useState } from 'react';
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setLoading, setError, setRepoInfo, setIssues } from '../store/kanbanSlice';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();

  const extractRepoInfo = (url: string) => {
    try {
      const urlObj = new URL(url);
      const [, owner, repo] = urlObj.pathname.split('/');
      return { owner, repo };
    } catch (error) {
      throw new Error('Invalid GitHub repository URL');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const { owner, repo } = extractRepoInfo(repoUrl);
      
      // Fetch repo info
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      
      if (!repoResponse.ok) {
        throw new Error('Repository not found');
      }
      
      const repoData = await repoResponse.json();
      dispatch(setRepoInfo(repoData));
      
      // Fetch issues
      const issuesResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`
      );
      
      if (!issuesResponse.ok) {
        throw new Error('Failed to fetch issues');
      }
      
      const issuesData = await issuesResponse.json();
      dispatch(setIssues(issuesData));
      
      toast({
        title: 'Success',
        description: 'Repository issues loaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      dispatch(setError(message));
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel>GitHub Repository URL</FormLabel>
        <InputGroup size="lg">
          <Input
            placeholder="https://github.com/facebook/react"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            pr="4.5rem"
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              type="submit"
              colorScheme="blue"
              leftIcon={<Search size={16} />}
            >
              Load
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </form>
  );
};

export default SearchBar;