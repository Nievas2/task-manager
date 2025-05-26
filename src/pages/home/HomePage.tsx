import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { Card } from "@/components/shared/Card"
import { Column } from "@/components/shared/Column"
import { useDndApp } from "@/context/dnd-context"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Typed from "typed.js"
import { Icon } from "@iconify/react/dist/iconify.js"

const HomePage = () => {
  const textTyped = useRef(null)
  // Obtener el estado y funciones del contexto DnD
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
        "Prueba dar click derecho en las tarjetas... quizás eso es lo que buscas ✨",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: false,
      startDelay: 3000, 
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

  // Variantes de animación para Framer Motion
  const headerVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const boardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        staggerChildren: 0.1,
      },
    },
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 w-full max-w-8xl">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Header mejorado */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center gap-6 mb-8 relative z-10"
        >
          <motion.div variants={childVariants} className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2 tracking-tight">
              Task Manager
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.p
            variants={childVariants}
            className="text-gray-300 text-lg font-medium max-w-md text-center leading-relaxed"
          >
            Arrastra y suelta las tarjetas entre las columnas para organizar tu
            flujo de trabajo
          </motion.p>

          <motion.div
            variants={childVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 1 },
            }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4 shadow-2xl min-h-[60px] flex items-center justify-center"
          >
            <span
              className="text-purple-300 text-base font-medium min-h-[24px] flex items-center"
              ref={textTyped}
            ></span>
          </motion.div>
        </motion.div>

        {/* Board mejorado */}
        <motion.div
          variants={boardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            <SortableContext
              items={columns.map((col) => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column, index) => (
                <motion.div
                  key={column.id}
                  variants={columnVariants}
                  custom={index}
                  className="flex-shrink-0"
                >
                  <Column
                    id={column.id}
                    title={column.title}
                    cards={column.cards}
                  />
                </motion.div>
              ))}
            </SortableContext>

            {/* Botón de agregar columna mejorado */}
            <motion.div
              variants={columnVariants}
              custom={columns.length}
              className="flex-shrink-0"
            >
              <motion.button
                className="group relative bg-gradient-to-br from-slate-700/80 to-slate-800/80 backdrop-blur-sm border-2 border-dashed border-slate-600 hover:border-purple-400 text-slate-300 hover:text-white p-6 rounded-2xl transition-all duration-300 w-80 h-32 flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newColumn = {
                    id: `column-${columns.length + 1}`,
                    title: `Columna ${columns.length + 1}`,
                    cards: [],
                  }
                  setColumns((prev) => [...prev, newColumn])
                }}
              >
                <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">
                    <Icon icon="mdi:plus" className="w-6 h-6" />
                  </span>
                </div>
                <span className="text-sm font-semibold tracking-wide">
                  Agregar Columna
                </span>

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* DragOverlay mejorado */}
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>
              {activeCard ? (
                <motion.div
                  initial={{ scale: 1, rotate: 0 }}
                  animate={{
                    scale: 1.05,
                    rotate: 2,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    id={activeCard.id}
                    content={activeCard.content}
                    isDragging
                  />
                </motion.div>
              ) : activeColumn ? (
                <motion.div
                  initial={{ scale: 1, rotate: 0 }}
                  animate={{
                    scale: 1.02,
                    rotate: 1,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Column
                    id={activeColumn.id}
                    title={activeColumn.title}
                    cards={activeColumn.cards}
                  />
                </motion.div>
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  )
}

export default HomePage
