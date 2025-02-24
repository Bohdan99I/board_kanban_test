import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KanbanState, GitHubIssue, RepoInfo } from '../types';

const STORAGE_KEY = 'kanbanState';
const REPOS_KEY = 'kanbanRepos';

interface StoredRepoState {
  columns: KanbanState['columns'];
  repoInfo: RepoInfo;
}

const getStoredRepos = (): Record<string, StoredRepoState> => {
  const stored = localStorage.getItem(REPOS_KEY);
  return stored ? JSON.parse(stored) : {};
};

const getInitialState = (): KanbanState => {
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    columns: {
      todo: { id: 'todo', title: 'To Do', issues: [] },
      inProgress: { id: 'inProgress', title: 'In Progress', issues: [] },
      done: { id: 'done', title: 'Done', issues: [] },
    },
    repoInfo: null,
    loading: false,
    error: null,
  };
};

const saveState = (state: KanbanState) => {
  if (state.repoInfo) {
    const repos = getStoredRepos();
    repos[state.repoInfo.html_url] = {
      columns: state.columns,
      repoInfo: state.repoInfo,
    };
    localStorage.setItem(REPOS_KEY, JSON.stringify(repos));
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState: getInitialState(),
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRepoInfo: (state, action: PayloadAction<RepoInfo>) => {
      const repoUrl = action.payload.html_url;
      const storedRepos = getStoredRepos();

      if (storedRepos[repoUrl]) {
        state.columns = storedRepos[repoUrl].columns;
        state.repoInfo = storedRepos[repoUrl].repoInfo;
      } else {
        state.repoInfo = action.payload;
      }

      saveState(state);
    },
    setIssues: (state, action: PayloadAction<GitHubIssue[]>) => {
      const issues = action.payload;
      const storedRepos = getStoredRepos();
      const currentRepoUrl = state.repoInfo?.html_url;

      if (currentRepoUrl && storedRepos[currentRepoUrl]) {
        const existingIssues = new Set(
          Object.values(state.columns)
            .flatMap(column => column.issues)
            .map(issue => issue.id)
        );

        const newTodoIssues = issues
          .filter(issue =>
            !existingIssues.has(issue.id) &&
            issue.state === 'open' &&
            !issue.assignee
          );

        const newInProgressIssues = issues
          .filter(issue =>
            !existingIssues.has(issue.id) &&
            issue.state === 'open' &&
            issue.assignee
          );

        const newDoneIssues = issues
          .filter(issue =>
            !existingIssues.has(issue.id) &&
            issue.state === 'closed'
          );

        state.columns.todo.issues.push(...newTodoIssues);
        state.columns.inProgress.issues.push(...newInProgressIssues);
        state.columns.done.issues.push(...newDoneIssues);
      } else {
        state.columns.todo.issues = issues.filter(
          issue => issue.state === 'open' && !issue.assignee
        );

        state.columns.inProgress.issues = issues.filter(
          issue => issue.state === 'open' && issue.assignee
        );

        state.columns.done.issues = issues.filter(
          issue => issue.state === 'closed'
        );
      }

      saveState(state);
    },
    moveIssue: (state, action: PayloadAction<{
      issueId: number;
      sourceColumn: string;
      destinationColumn: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { issueId, sourceColumn, destinationColumn, sourceIndex, destinationIndex } = action.payload;

      const issue = state.columns[sourceColumn].issues.find(i => i.id === issueId);
      if (!issue) return;

      state.columns[sourceColumn].issues.splice(sourceIndex, 1);
      state.columns[destinationColumn].issues.splice(destinationIndex, 0, issue);

      saveState(state);
    },
    clearIssues: (state) => {
      state.columns.todo.issues = [];
      state.columns.inProgress.issues = [];
      state.columns.done.issues = [];
      saveState(state);
    },
  },
});

export const { setLoading, setError, setRepoInfo, setIssues, moveIssue, clearIssues } = kanbanSlice.actions;
export default kanbanSlice.reducer;