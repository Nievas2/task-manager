import { Draggable } from "@/components/shared/Draggable"
import { Droppable } from "@/components/shared/Droppable"
import {
  DndContext,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { useState } from "react"

const HomePage = () => {
  const containers = ["A", "B", "C"]
  const [parent, setParent] = useState<UniqueIdentifier | null>(null)
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>
  function handleDragEnd(event: DragEndEvent) {
    const { over } = event
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : null)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <DndContext onDragEnd={handleDragEnd}>
        {parent === null ? draggableMarkup : null}

        {containers.map((id) => (
          // We updated the Droppable component so it would accept an `id`
          // prop and pass it to `useDroppable`
          <Droppable key={id} id={id}>
            {parent === id ? draggableMarkup : "Drop here"}
          </Droppable>
        ))}
      </DndContext>
    </main>
  )
}
export default HomePage
