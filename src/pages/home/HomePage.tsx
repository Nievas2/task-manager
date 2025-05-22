import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { Card } from "@/components/shared/Card"
import { Column } from "@/components/shared/Column"
import { useDndApp } from "@/context/dnd-context"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Typed from "typed.js"

const HomePage = () => {
  const textTyped = useRef(null)
  const {
    columns,
    activeCard,
    activeColumn,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setColumns,
    saveColumnsToLocalStorage,
  } = useDndApp()
  // Typed.js
  useEffect(() => {
    const typed = new Typed(textTyped.current, {
      strings: [
        "Prueba dar click derecho en las tarjetas quizas eso es lo que buscas.",
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: false,
      showCursor: false,
      startDelay: 5000,
    })

    return () => {
      typed.destroy()
    }
  }, [])

  // Guardar columnas en localStorage al cambiar
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    saveColumnsToLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-xl font-bold text-white">
          Task Manager
        </h1>
        <p className="text-gray-200">
          Arrastra y suelta las tarjetas entre las columnas.
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, transition: { duration: 0.35 }, y: 0 }}
          className="font-bold text-sm text-center text-gray-200 max-w-full min-h-5"
          ref={textTyped}
        ></motion.h1>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full w-full p-2">
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={verticalListSortingStrategy}
        >
          {columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              cards={column.cards}
            />
          ))}
        </SortableContext>
        <div>
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer w-36"
            onClick={() => {
              const newColumn = {
                id: `column-${columns.length + 1}`,
                title: `Columna ${columns.length + 1}`,
                cards: [],
              }
              setColumns((prev) => [...prev, newColumn])
            }}
          >
            <span className="text-sm">+ Agregar columna</span>
          </button>
        </div>
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeCard ? (
              <Card
                id={activeCard.id}
                content={activeCard.content}
                isDragging
              />
            ) : activeColumn ? (
              <Column
                id={activeColumn.id}
                title={activeColumn.title}
                cards={activeColumn.cards}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  )
}
export default HomePage
