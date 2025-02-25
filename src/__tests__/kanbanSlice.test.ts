import { describe, it, expect, beforeEach, vi } from 'vitest';
import kanbanReducer, {
  setLoading,
  setError,
  setRepoInfo,
  setIssues,
  moveIssue
} from '../store/kanbanSlice';

describe('kanbanSlice', () => {
  const initialState = {
    columns: {
      todo: { id: 'todo', title: 'To Do', issues: [] },
      inProgress: { id: 'inProgress', title: 'In Progress', issues: [] },
      done: { id: 'done', title: 'Done', issues: [] }
    },
    repoInfo: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    vi.spyOn(window.localStorage, 'clear').mockImplementation(() => { });
  });

  it('should handle initial state', () => {
    vi.spyOn(window.localStorage, 'getItem').mockReturnValue(null);

    const actual = kanbanReducer(undefined, { type: 'unknown' });
    expect(actual.columns).toEqual(initialState.columns);
    expect(actual.loading).toBe(false);
    expect(actual.error).toBe(null);
  });

  it('should handle setLoading', () => {
    const actual = kanbanReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Test error';
    const actual = kanbanReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
  });

  it('should handle setRepoInfo', () => {
    const repoInfo = {
      id: 123,
      name: 'Test Repo',
      owner: {
        login: 'test',
        html_url: 'https://github.com/test',
        avatar_url: 'https://avatars.githubusercontent.com/u/123456?v=4'
      },
      url: 'https://github.com/test/repo',
      html_url: 'https://github.com/test/repo'
    };

    const actual = kanbanReducer(initialState, setRepoInfo(repoInfo));
    expect(actual.repoInfo).toEqual(repoInfo);
  });

  it('should handle setIssues', () => {
    const issues = [
      {
        id: 1,
        number: 1,
        title: 'Test Issue',
        state: 'open',
        assignee: null,
        created_at: '2024-02-20T12:00:00Z',
        html_url: 'https://github.com/test/repo/issues/1'
      },
      {
        id: 2,
        number: 2,
        title: 'Another Test Issue',
        state: 'open',
        assignee: null,
        created_at: '2024-02-20T12:00:00Z',
        html_url: 'https://github.com/test/repo/issues/2'
      }
    ];

    const actual = kanbanReducer(initialState, setIssues(issues));
    expect(actual.columns.todo.issues).toEqual(issues);
  });

  it('should handle moveIssue', () => {
    const state = {
      ...initialState,
      columns: {
        ...initialState.columns,
        todo: {
          ...initialState.columns.todo,
          issues: [
            {
              id: 1,
              number: 1,
              title: 'Test Issue',
              state: 'open',
              assignee: null,
              created_at: '2024-02-20T12:00:00Z',
              html_url: 'https://github.com/test/repo/issues/1'
            }
          ]
        }
      }
    };

    const actual = kanbanReducer(state, moveIssue({
      issueId: 1,
      sourceColumn: 'todo',
      destinationColumn: 'inProgress',
      sourceIndex: 0,
      destinationIndex: 0
    }));

    expect(actual.columns.todo.issues).toHaveLength(0);
    expect(actual.columns.inProgress.issues).toHaveLength(1);
    expect(actual.columns.inProgress.issues[0].id).toBe(1);
  });
});