import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { BrowserRouter } from "react-router-dom"
import { useDndContext } from "../context/dnd-context"

const Contexts = ({ children }: { children: React.ReactNode }) => {
  const { parent, setParent } = useDndContext()
  function handleDragEnd(event: DragEndEvent) {
    const { over } = event
    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    setParent(over ? over.id : parent)
  }
  return (
    <BrowserRouter>
      <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>
    </BrowserRouter>
  )
}
export default Contexts
