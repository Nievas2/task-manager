import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import { BrowserRouter } from "react-router-dom"
import { DndContextProvider, useDndContext } from "../context/dnd-context"

function DndContextWrapper({ children }: { children: React.ReactNode }) {
  const { moveToContainer } = useDndContext()
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    moveToContainer(active.id as string, over ? (over.id as string) : null)
  }
  return <DndContext onDragEnd={handleDragEnd}>{children}</DndContext>
}

const Contexts = ({ children }: { children: React.ReactNode }) => (
  <DndContextProvider>
    <BrowserRouter>
      <DndContextWrapper>{children}</DndContextWrapper>
    </BrowserRouter>
  </DndContextProvider>
)
export default Contexts
