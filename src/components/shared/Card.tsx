import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { useRef, useState, useEffect } from "react"
import { useDndApp } from "@/context/dnd-context"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

type CardProps = {
  id: UniqueIdentifier
  content: string
  isDragging?: boolean
  editable?: boolean
  onEditEnd?: () => void
}

export function Card({
  id,
  content,
  isDragging = false,
  editable = false,
  onEditEnd,
}: CardProps) {
  const { setColumns } = useDndApp()
  const [isEditing, setIsEditing] = useState(editable)
  const [inputValue, setInputValue] = useState(content)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus automático cuando se activa el modo de edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Sincroniza el valor del input con el estado
  const handleSave = () => {
    // Elimina la tarjeta si está vacía
    if (inputValue.trim() === "") {
      setColumns((prev) =>
        prev.map((column) => ({
          ...column,
          cards: column.cards.filter((c) => c.id !== id),
        }))
      )
    } else {
      // Guarda el contenido editado
      setColumns((prev) =>
        prev.map((column) => ({
          ...column,
          cards: column.cards.map((c) =>
            c.id === id ? { ...c, content: inputValue } : c
          ),
        }))
      )
    }
    setIsEditing(false)
    if (onEditEnd) onEditEnd()
  }

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        type: "card",
      },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Muestra el contenido de la tarjeta con el modo de edición
  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-full bg-gray-300 p-3 rounded-xl shadow-lg"
      >
        <input
          ref={inputRef}
          className="w-full p-2 rounded border-none ring-0 outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
          }}
          placeholder="Escribe el contenido..."
        />
      </div>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          className={`w-full bg-gray-300 p-3 cursor-grab rounded-xl shadow-lg relative group ${
            isDragging ? "opacity-50" : ""
          } not-selectable`}
          {...attributes}
          {...listeners}
          onDoubleClick={() => setIsEditing(true)}
        >
          <p className="text-gray-600 w-[100%] group-hover:w-[90%]">
            {content}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setIsEditing(true)}>
          <span>Editar</span>
        </ContextMenuItem>
        <hr />
        <ContextMenuItem
          onClick={() => {
            setColumns((prev) =>
              prev.map((column) => ({
                ...column,
                cards: column.cards.filter((c) => c.id !== id),
              }))
            )
          }}
        >
          <span>Eliminar</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
