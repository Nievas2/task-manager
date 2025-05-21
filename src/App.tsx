import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/home/HomePage"
import { Navbar } from "./components/shared/Navbar"

export function App() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </main>
  )
}
