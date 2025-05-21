import { Draggable } from "@/components/shared/Draggable"
import { Droppable } from "@/components/shared/Droppable"
import {  useDndContext } from "@/context/dnd-context"

const containers = ["1", "2", "3"]
const draggables = ["a", "b", "c"]

const HomePage = () => {
  const dnd = useDndContext()

  // Draggables que no están en ningún droppable
  const unassigned = draggables.filter(
    (dragId) => !containers.some((cid) => dnd.containers[cid]?.includes(dragId))
  )

  return (
    <main className="flex flex-col w-full min-h-screen">
      {unassigned.map((dragId) => (
        <Draggable key={dragId} id={dragId}>
          Drag {dragId}
        </Draggable>
      ))}
      <section className="flex gap-3 items-start justify-start p-4 w-full overflow-x-auto">
        {containers.map((id) => (
          <div key={id} className="flex-shrink-0">
            <Droppable id={id}>
              {dnd.containers[id].map((dragId) => (
                <Draggable key={dragId} id={dragId}>
                  Drag {dragId}
                </Draggable>
              ))}
              {dnd.containers[id].length === 0 && ""}
            </Droppable>
          </div>
        ))}
        <button >
          <span className="text-sm text-gray-500">+ Agregar una columna</span>
        </button>
      </section>
    </main>
  )
}
export default HomePage
