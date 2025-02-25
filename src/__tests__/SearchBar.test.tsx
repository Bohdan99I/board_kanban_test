import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import kanbanReducer from "../store/kanbanSlice";
import SearchBar from "../components/SearchBar";
import { ChakraProvider } from "@chakra-ui/react";
import { vi, expect, describe, it, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const createTestStore = () => {
  return configureStore({
    reducer: {
      kanban: kanbanReducer,
    },
  });
};

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    global.fetch = vi.fn();
  });

  it("renders search input and button", () => {
    render(
      <Provider store={createTestStore()}>
        <ChakraProvider>
          <SearchBar />
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByPlaceholderText(/github.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /load/i })).toBeInTheDocument();
  });

  it("validates repository URL", async () => {
    const mockRepoData = {
      id: 1,
      name: "test-repo",
      owner: {
        login: "test-user",
        avatar_url: "https://example.com/avatar.png",
        html_url: "https://github.com/test-user",
      },
      html_url: "https://github.com/test-user/test-repo",
    };

    const mockIssuesData = [
      {
        id: 1,
        number: 1,
        title: "Test Issue",
        state: "open",
        assignee: null,
        created_at: "2024-02-20T12:00:00Z",
        html_url: "https://github.com/test-user/test-repo/issues/1",
      },
    ];

    const mockFetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRepoData),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockIssuesData),
        })
      );

    global.fetch = mockFetch;

    const user = userEvent.setup();

    render(
      <Provider store={createTestStore()}>
        <ChakraProvider>
          <SearchBar />
        </ChakraProvider>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/github.com/i);
    const submitButton = screen.getByRole("button", { name: /load/i });

    await user.type(input, "https://github.com/facebook/react");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      },
      { timeout: 3000 }
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/facebook/react"
    );
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.github.com/repos/facebook/react/issues?state=all&per_page=100"
    );
  });

  it("handles invalid repository URL", async () => {
    const mockFetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    global.fetch = mockFetch;

    const user = userEvent.setup();

    render(
      <Provider store={createTestStore()}>
        <ChakraProvider>
          <SearchBar />
        </ChakraProvider>
      </Provider>
    );

    const input = screen.getByPlaceholderText(/github.com/i);
    const submitButton = screen.getByRole("button", { name: /load/i });

    await user.type(input, "https://github.com/invalid/repo");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText(/repository not found/i)).toBeInTheDocument();
    });
  });
});
