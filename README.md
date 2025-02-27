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
