# board_kanban_test

A React application that allows you to visualize and manage GitHub repository issues using a Kanban board interface.

## Features

- Load any public GitHub repository by URL
- Visualize issues in a Kanban board with three columns:
  - **To Do**: Open issues without an assignee
  - **In Progress**: Open issues with an assignee
  - **Done**: Closed issues
- Drag and drop issues between columns to change their status
- Persistent storage of board state for each repository

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit for state management
- Chakra UI for components and styling
- React Beautiful DnD for drag and drop functionality
- Vitest and React Testing Library for testing

## Project Structure

```
src/
├── components/         # React components
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── __tests__/          # Test files
```

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/github-kanban-board.git
   cd github-kanban-board
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Enter a GitHub repository URL in the search bar (e.g., `https://github.com/facebook/react`)
2. Click the "Load" button to fetch the repository's issues
3. The issues will be automatically sorted into the appropriate columns:
   - Open issues without assignees go to "To Do"
   - Open issues with assignees go to "In Progress"
   - Closed issues go to "Done"
4. Drag and drop issues between columns to change their status
5. Click on an issue title to open it in GitHub

## Future Enhancements

- GitHub authentication to increase API rate limits
- Ability to create and edit issues directly from the board
- Pagination or infinite scrolling for repositories with many issues
- Filtering and searching issues
- Custom column creation

## License

This project is licensed under the MIT License - see the LICENSE file for details.
