import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "../store/kanbanSlice";
import KanbanBoard from "../components/KanbanBoard";
import { ChakraProvider } from "@chakra-ui/react";
import { vi, afterEach, describe, it, expect } from "vitest";

const mockIssue = {
  id: 1,
  number: 1,
  title: "Test Issue",
  state: "open",
  assignee: null,
  created_at: "2024-02-20T12:00:00Z",
  html_url: "https://github.com/test/repo/issues/1",
};

const initialState = {
  kanban: {
    columns: {
      todo: {
        id: "todo",
        title: "To Do",
        issues: [mockIssue],
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        issues: [],
      },
      done: {
        id: "done",
        title: "Done",
        issues: [],
      },
    },
    repoInfo: null,
    loading: false,
    error: null,
  },
};

vi.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (args: {
      innerRef: () => void;
      droppableProps: object;
      placeholder: null;
    }) => React.ReactNode;
  }) =>
    children({
      innerRef: () => {},
      droppableProps: {},
      placeholder: null,
    }),
  Draggable: ({
    children,
  }: {
    children: (args: {
      innerRef: () => void;
      draggableProps: object;
      dragHandleProps: object;
    }) => React.ReactNode;
  }) =>
    children({
      innerRef: () => {},
      draggableProps: {},
      dragHandleProps: {},
    }),
}));

const createTestStore = (preloadedState = initialState) => {
  return configureStore({
    reducer: {
      kanban: kanbanReducer,
    },
    preloadedState,
  });
};

describe("KanbanBoard", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all columns", () => {
    render(
      <Provider store={createTestStore()}>
        <ChakraProvider>
          <KanbanBoard />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText("To Do (1)")).toBeInTheDocument();
    expect(screen.getByText("In Progress (0)")).toBeInTheDocument();
    expect(screen.getByText("Done (0)")).toBeInTheDocument();
  });

  it("displays issues in correct columns", () => {
    render(
      <Provider store={createTestStore()}>
        <ChakraProvider>
          <KanbanBoard />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText("#1 Test Issue")).toBeInTheDocument();
  });
});
