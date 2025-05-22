import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

export type CardType = {
  id: string
  content: string
}

type ColumnType = {
  id: string
  title: string
  cards: CardType[]
}

type DndContextType = {
  columns: ColumnType[]
  setColumns: React.Dispatch<React.SetStateAction<ColumnType[]>>
  activeCard: CardType | null
  activeColumn: ColumnType | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sensors: any
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  saveColumnsToLocalStorage: () => void
}

const DndContextApp = createContext<DndContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useDndApp() {
  const ctx = useContext(DndContextApp)
  if (!ctx) throw new Error("useDndApp debe usarse dentro de DndAppProvider")
  return ctx
}

export function DndAppProvider({ children }: { children: React.ReactNode }) {
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      id: "column-1",
      title: "Por hacer",
      cards: [
        {
          id: "card-1",
          content: "Descripción de la tarea 1",
        },
        {
          id: "card-2",
          content: "Descripción de la tarea 2",
        },
      ],
    },
    {
      id: "column-2",
      title: "En progreso",
      cards: [
        {
          id: "card-3",
          content: "Descripción de la tarea 3",
        },
      ],
    },
    {
      id: "column-3",
      title: "Completado",
      cards: [],
    },
  ])
  const [activeCard, setActiveCard] = useState<CardType | null>(null)
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null)
  // Cargar columnas desde localStorage al iniciar
  useEffect(() => {
    const columnsFromLocalStorage = localStorage.getItem("columns")
    if (columnsFromLocalStorage) {
      setColumns(JSON.parse(columnsFromLocalStorage))
    }
  }, [])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 0, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  )

  // Helpers
  const findColumnByCardId = useCallback(
    (cardId: UniqueIdentifier) =>
      columns.find((column) => column.cards.some((card) => card.id === cardId)),
    [columns]
  )

  const findCardById = useCallback(
    (cardId: UniqueIdentifier) => {
      for (const column of columns) {
        const card = column.cards.find((card) => card.id === cardId)
        if (card) return card
      }
      return null
    },
    [columns]
  )

  // Handlers
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event
      const card = findCardById(active.id)
      if (card) {
        setActiveCard(card)
        setActiveColumn(null)
        return
      }
      const column = columns.find((col) => col.id === active.id)
      if (column) {
        setActiveColumn(column)
        setActiveCard(null)
      }
    },
    [findCardById, columns]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id
      const overId = over.id

      const activeColumn = findColumnByCardId(activeId)
      const overColumn = columns.find((col) => col.id === overId)

      if (!activeColumn) return

      // Si arrastro sobre una columna vacía
      if (overColumn && overColumn.cards.length === 0) {
        const activeCard = findCardById(activeId)
        if (!activeCard) return

        setColumns((columns) =>
          columns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                cards: col.cards.filter((card) => card.id !== activeId),
              }
            }
            if (col.id === overColumn.id) {
              return {
                ...col,
                cards: [activeCard],
              }
            }
            return col
          })
        )
        return
      }

      // Si la tarjeta se arrastra sobre otra tarjeta en otra columna
      const overCardColumn = findColumnByCardId(overId)
      if (overCardColumn && activeColumn.id !== overCardColumn.id) {
        const activeCard = findCardById(activeId)
        if (!activeCard) return

        setColumns((columns) => {
          return columns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                cards: col.cards.filter((card) => card.id !== activeId),
              }
            }
            if (col.id === overCardColumn.id) {
              const overIndex = col.cards.findIndex(
                (card) => card.id === overId
              )
              const newCards = [...col.cards]
              newCards.splice(overIndex, 0, activeCard)
              return {
                ...col,
                cards: newCards,
              }
            }
            return col
          })
        })
        return
      }

      // Reordenar dentro de la misma columna
      if (activeColumn.id === overCardColumn?.id && activeId !== overId) {
        setColumns((columns) => {
          return columns.map((col) => {
            if (col.id === activeColumn.id) {
              const oldIndex = col.cards.findIndex(
                (card) => card.id === activeId
              )
              const newIndex = col.cards.findIndex((card) => card.id === overId)
              return {
                ...col,
                cards: arrayMove(col.cards, oldIndex, newIndex),
              }
            }
            return col
          })
        })
      }
    },
    [columns, findCardById, findColumnByCardId]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null)
      setActiveColumn(null)
      const { active, over } = event
      if (!over) return

      // Si se está moviendo una columna
      const activeColumnIndex = columns.findIndex((col) => col.id === active.id)
      const overColumnIndex = columns.findIndex((col) => col.id === over.id)
      if (
        activeColumnIndex !== -1 &&
        overColumnIndex !== -1 &&
        activeColumnIndex !== overColumnIndex
      ) {
        setColumns((columns) =>
          arrayMove(columns, activeColumnIndex, overColumnIndex)
        )
        return
      }

      const activeColumn = findColumnByCardId(active.id)
      const overColumn = findColumnByCardId(over.id)

      if (
        !activeColumn ||
        !overColumn ||
        activeColumn.id !== overColumn.id ||
        active.id === over.id
      ) {
        setActiveCard(null)
        return
      }

      const oldIndex = activeColumn.cards.findIndex(
        (card) => card.id === active.id
      )
      const newIndex = overColumn.cards.findIndex((card) => card.id === over.id)

      if (oldIndex !== newIndex) {
        setColumns((columns) => {
          return columns.map((col) => {
            if (col.id === activeColumn.id) {
              return {
                ...col,
                cards: arrayMove(col.cards, oldIndex, newIndex),
              }
            }
            return col
          })
        })
      }
      setActiveCard(null)
    },
    [columns, findColumnByCardId]
  )

  const saveColumnsToLocalStorage = useCallback(() => {
    localStorage.setItem("columns", JSON.stringify(columns))
  }, [columns])

  return (
    <DndContextApp.Provider
      value={{
        columns,
        setColumns,
        activeCard,
        activeColumn,
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        saveColumnsToLocalStorage
      }}
    >
      {children}
    </DndContextApp.Provider>
  )
}
