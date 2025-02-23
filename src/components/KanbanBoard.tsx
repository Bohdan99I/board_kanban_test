import React from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { moveIssue } from '../store/kanbanSlice';
import IssueCard from './IssueCard';

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const { columns } = useSelector((state: RootState) => state.kanban);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    dispatch(moveIssue({
      issueId: parseInt(draggableId),
      sourceColumn: source.droppableId,
      destinationColumn: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SimpleGrid columns={3} spacing={6}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Box key={columnId}>
            <Box
              bg="gray.100"
              p={4}
              borderRadius="lg"
              minH="500px"
            >
              <Box mb={4} fontWeight="bold" fontSize="lg">
                {column.title} ({column.issues.length})
              </Box>
              
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    minH="400px"
                  >
                    {column.issues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            mb={4}
                          >
                            <IssueCard issue={issue} />
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </DragDropContext>
  );
};

export default KanbanBoard;