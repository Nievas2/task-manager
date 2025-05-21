export function Navbar() {
  return (
    <nav className="w-full sticky top-0 left-0 z-50 bg-white/10 backdrop-blur-md shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold ">Task Manager</div>
        <ul className="flex space-x-6">
          <li>
            {/* <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition"
            > */}
            Home
            {/*  </a> */}
          </li>
        </ul>
      </div>
    </nav>
  )
}
