import { BrowserRouter } from "react-router-dom"
import { DndAppProvider } from "../context/dnd-context"

const Contexts = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <DndAppProvider>{children}</DndAppProvider>
  </BrowserRouter>
)
export default Contexts
