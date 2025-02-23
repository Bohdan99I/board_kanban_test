export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  assignee: {
    login: string;
    avatar_url: string;
  } | null;
  created_at: string;
  html_url: string;
}

export interface RepoInfo {
  name: string;
  owner: {
    login: string;
    html_url: string;
    avatar_url: string;
  };
  html_url: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  issues: GitHubIssue[];
}

export interface KanbanState {
  columns: {
    [key: string]: KanbanColumn;
  };
  repoInfo: RepoInfo | null;
  loading: boolean;
  error: string | null;
}