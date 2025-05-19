import { Draggable } from "@/components/shared/Draggable"
import { Droppable } from "@/components/shared/Droppable"
import { useDndContext } from "@/context/dnd-context"

const HomePage = () => {
  const containers = ["A", "B", "C"]
  const { parent } = useDndContext()
  const draggableMarkup = <Draggable id="draggable">Drag me</Draggable>

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : "Drop here"}
        </Droppable>
      ))}
    </main>
  )
}
export default HomePage
