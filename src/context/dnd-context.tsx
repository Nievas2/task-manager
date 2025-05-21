import { createContext, useContext, useState } from "react"

interface DndContextType {
  containers: Record<string, string[]> // droppableId: draggableIds[]
  moveToContainer: (draggableId: string, droppableId: string | null) => void
}
export const DragAndDropContext = createContext<DndContextType>({
  containers: {},
  moveToContainer: () => {},
})

export const useDndContext = (): DndContextType => {
  const context = useContext(DragAndDropContext)
  if (!context) {
    throw new Error("useDndContext must be used within a DndContextProvider")
  }
  return context
}

export const DndContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [containers, setContainers] = useState<Record<string, string[]>>({
    "1": [],
    "2": [],
    "3": [],
  })

  const moveToContainer = (draggableId: string, droppableId: string | null) => {
    setContainers((prev) => {
      // Quitar el draggable de todos los arrays
      const newContainers = Object.fromEntries(
        Object.entries(prev).map(([cid, arr]) => [
          cid,
          arr.filter((id) => id !== draggableId),
        ])
      )
      // Si hay droppable destino, agregarlo al final
      if (droppableId && newContainers[droppableId]) {
        newContainers[droppableId] = [
          ...newContainers[droppableId],
          draggableId,
        ]
      }
      return newContainers
    })
  }

  return (
    <DragAndDropContext.Provider value={{ containers, moveToContainer }}>
      {children}
    </DragAndDropContext.Provider>
  )
}
