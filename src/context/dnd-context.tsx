import type { UniqueIdentifier } from "@dnd-kit/core"
import { createContext, useContext, useState } from "react"

interface DndContextType {
  parent: UniqueIdentifier | null
  setParent: (parent: UniqueIdentifier | null) => void
}
const DndContext = createContext<DndContextType | undefined>(undefined)

export const useDndContext = (): DndContextType => {
  const context = useContext(DndContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider")
  }
  return context
}
export const DndContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [parent, setParent] = useState<UniqueIdentifier | null>(null)
  return (
    <DndContext.Provider
      value={{
        parent,
        setParent,
      }}
    >
      {children}
    </DndContext.Provider>
  )
}
