import React from 'react';
import { Box, Flex, Link, Text, Avatar } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ExternalLink } from 'lucide-react';

const RepoHeader: React.FC = () => {
  const repoInfo = useSelector((state: RootState) => state.kanban.repoInfo);

  if (!repoInfo) return null;

  return (
    <Box mb={6} p={4} bg="white" borderRadius="lg" shadow="sm">
      <Flex alignItems="center" gap={4}>
        <Avatar size="md" src={repoInfo.owner.avatar_url} />
        <Box>
          <Flex alignItems="center" gap={2}>
            <Link href={repoInfo.owner.html_url} isExternal color="blue.500">
              {repoInfo.owner.login}
            </Link>
            <Text>/</Text>
            <Link href={repoInfo.html_url} isExternal color="blue.500" fontWeight="bold">
              {repoInfo.name}
            </Link>
            <ExternalLink size={16} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default RepoHeader;