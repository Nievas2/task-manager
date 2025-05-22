import { CSS } from "@dnd-kit/utilities"
import type { UniqueIdentifier } from "@dnd-kit/core"
import { Card } from "./Card"
import { useDndApp, type CardType } from "@/context/dnd-context"
import { Icon } from "@iconify/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { columnSchema } from "@/utils/schema/Column"
import { useRef, useState, useEffect } from "react"
import debounce from "debounce"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"

type ColumnProps = {
  id: UniqueIdentifier
  title: string
  cards: CardType[]
}

export function Column({ id, title, cards }: ColumnProps) {
  const { setColumns } = useDndApp()
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [, setNewCardContent] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "column",
    },
  })
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title,
    },
    resolver: zodResolver(columnSchema),
  })

  // Focus automático cuando se agrega una nueva tarjeta
  useEffect(() => {
    if (editingCardId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCardId])

  // Sincroniza el valor del input con el prop title
  useEffect(() => {
    reset({ title })
  }, [title, reset])

  const handleAddCard = () => {
    const newId = crypto.randomUUID()
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id
          ? { ...column, cards: [...column.cards, { id: newId, content: "" }] }
          : column
      )
    )
    setEditingCardId(newId)
    setNewCardContent("")
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const onSubmit = handleSubmit((data) => {
    setColumns((prev) =>
      prev.map((column) =>
        column.id === id ? { ...column, title: data.title } : column
      )
    )
  })

  const debounceFunction = debounce(onSubmit, 300)
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex min-w-72 h-[80vh] bg-gray-100 rounded-md shadow-md flex-col ${
        isDragging ? "opacity-50" : ""
      }`}
      {...attributes}
    >
      <div className="flex justify-center items-center p-3 font-semibold bg-gray-200 rounded-t-md cursor-grab gap-2">
        <div className="flex">
          {/* delete icon */}
          <Popover>
            <PopoverTrigger>
              <Icon
                icon={"octicon:trash-16"}
                width={18}
                className="text-gray-500 cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 justify-center items-center">
              <p className="text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar esta columna?
              </p>
              <Button
                onClick={() => {
                  setColumns((prev) =>
                    prev.filter((column) => column.id !== id)
                  )
                }}
              >
                Eliminar columna
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <input
            {...register("title")}
            onBlur={onSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit()
            }}
            onChange={(e) => {
              register("title").onChange(e) // Mantiene el control de react-hook-form
              debounceFunction()
            }}
            className="w-full border-none ring-0 outline-none"
          />
          {errors.title && (
            <small className="text-red-500 text-sm">
              {errors.title.message}
            </small>
          )}
        </div>

        <div {...listeners}>
          <Icon
            icon={"octicon:grabber-16"}
            width={18}
            className="text-gray-500 cursor-grab"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-2 overflow-y-auto h-[80vh]">
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              content={card.content}
              editable={editingCardId === card.id}
              onEditEnd={() => setEditingCardId(null)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="p-3 text-gray-500 text-center italic">
            No hay tarjetas
          </div>
        )}
      </div>

      <div className="p-3 font-semibold bg-gray-200 rounded-b-md cursor-grab">
        <button
          className="text-center cursor-pointer w-full"
          onClick={handleAddCard}
        >
          <span className="text-sm">+ Agregar tarjeta</span>
        </button>
      </div>
    </div>
  )
}
