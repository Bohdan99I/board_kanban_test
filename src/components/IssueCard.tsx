import React from "react";
import { Box, Link, Text, Avatar, Flex } from "@chakra-ui/react";
import { GitHubIssue } from "../types";

interface IssueCardProps {
  issue: GitHubIssue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      borderWidth="1px"
      _hover={{ boxShadow: "md" }}
      userSelect="none"
      width="100%"
    >
      <Link
        href={issue.html_url}
        isExternal
        color="blue.600"
        fontWeight="medium"
        onClick={(e) => e.stopPropagation()}
      >
        #{issue.number} {issue.title}
      </Link>

      {issue.assignee && (
        <Flex mt={3} alignItems="center" gap={2}>
          <Avatar size="xs" src={issue.assignee.avatar_url} />
          <Text fontSize="sm" color="gray.600">
            {issue.assignee.login}
          </Text>
        </Flex>
      )}

      <Text fontSize="xs" color="gray.500" mt={2}>
        Created: {new Date(issue.created_at).toLocaleDateString()}
      </Text>
    </Box>
  );
};

export default IssueCard;
