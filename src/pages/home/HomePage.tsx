import { useDroppable } from "@dnd-kit/core"

const HomePage = () => {
  const { setNodeRef } = useDroppable({
    id: "unique-id",
  })

  return (
    <div
      ref={setNodeRef}
      className="h-screen w-screen bg-gray-900 flex items-center justify-center"
    >
      /* Render whatever you like within */
    </div>
  )
}
export default HomePage
