import React from "react"
import { useDroppable } from "@dnd-kit/core"

export function Droppable(props: { children: React.ReactNode; id: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  })
  const style = {
    color: isOver ? "green" : undefined,
  }

  return (
    <div className="flex flex-col min-w-64 w-full text-white rounded-lg border border-gray-200 h-full">
      <div className="flex items-center justify-between bg-gray-950 p-2 rounded-t-lg">
        <span>Nombre</span>
      </div>
      <div ref={setNodeRef} style={style} className="min-h-16 h-full p-2 bg-gray-900">
        {props.children}
      </div>
      <button className="flex items-center justify-center gap-2 p-2 bg-gray-950 rounded-b-lg">
        <span className="text-sm text-gray-500">+ Agregar una tarjeta</span>
      </button>
    </div>
  )
}
