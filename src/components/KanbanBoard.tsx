import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { moveIssue } from "../store/kanbanSlice";
import IssueCard from "./IssueCard";

const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state: RootState) => state.kanban.columns);

  const handleDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    dispatch(
      moveIssue({
        issueId: Number(draggableId),
        sourceColumn: source.droppableId,
        destinationColumn: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SimpleGrid minChildWidth="300px" spacing={6}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Box key={columnId} p={2}>
            <Box bg="gray.100" p={4} borderRadius="lg" minH="500px">
              <Box mb={4} fontWeight="bold" fontSize="lg">
                {column.title} ({column.issues.length})
              </Box>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    minH="400px"
                    bg={snapshot.isDraggingOver ? "gray.200" : "gray.100"}
                    p={2}
                    borderRadius="md"
                    transition="background 0.2s ease-in-out"
                    border={
                      snapshot.isDraggingOver ? "2px dashed gray" : "none"
                    }
                  >
                    {column.issues.map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            mb={4}
                            bg={snapshot.isDragging ? "gray.300" : "white"}
                            p={3}
                            borderRadius="md"
                            boxShadow={snapshot.isDragging ? "xl" : "md"}
                            transition="background 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
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
