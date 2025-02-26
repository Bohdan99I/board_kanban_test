import React, { useState } from "react";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  setLoading,
  setError,
  setRepoInfo,
  setIssues,
  clearIssues, 
} from "../store/kanbanSlice";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const dispatch = useDispatch();
  const toast = useToast();

  const handleSearch = async () => {
    dispatch(setLoading(true));
    dispatch(clearIssues());
    try {
      const response = await fetch(`https://api.github.com/repos/${repoUrl}/issues`);
      const data = await response.json();
      dispatch(setIssues(data));
      dispatch(setRepoInfo({ 
        html_url: `https://github.com/${repoUrl}`, 
        name: repoUrl.split('/').pop() || '', 
        owner: { login: repoUrl.split('/')[1], html_url: '', avatar_url: '' } 
      }));
    } catch  {    
      dispatch(setError("Failed to fetch issues"));
      toast({ title: "Error", description: "Failed to fetch issues", status: "error" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <FormControl>
      <FormLabel>Repository URL</FormLabel>
      <HStack>
        <Input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Enter GitHub repo URL"
        />
        <Button onClick={handleSearch}>
          <Search />
        </Button>
      </HStack>
    </FormControl>
  );
};

export default SearchBar;