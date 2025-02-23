import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KanbanState, GitHubIssue, RepoInfo } from '../types';

const getInitialState = (): KanbanState => {
  const savedState = localStorage.getItem('kanbanState');
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
      state.repoInfo = action.payload;
    },
    setIssues: (state, action: PayloadAction<GitHubIssue[]>) => {
      const issues = action.payload;
      
      state.columns.todo.issues = issues.filter(
        issue => issue.state === 'open' && !issue.assignee
      );
      
      state.columns.inProgress.issues = issues.filter(
        issue => issue.state === 'open' && issue.assignee
      );
      
      state.columns.done.issues = issues.filter(
        issue => issue.state === 'closed'
      );
      
      localStorage.setItem('kanbanState', JSON.stringify(state));
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
      
      localStorage.setItem('kanbanState', JSON.stringify(state));
    },
  },
});

export const { setLoading, setError, setRepoInfo, setIssues, moveIssue } = kanbanSlice.actions;
export default kanbanSlice.reducer;