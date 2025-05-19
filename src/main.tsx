import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { DndContext } from "@dnd-kit/core"
import { App } from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DndContext>
        <App />
      </DndContext>
    </BrowserRouter>
  </StrictMode>
)
