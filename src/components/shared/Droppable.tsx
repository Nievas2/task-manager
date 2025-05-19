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
    <div
      ref={setNodeRef}
      style={style}
      className="text-white size-36 rounded-2xl border border-gray-200"
    >
      {props.children}
    </div>
  )
}
