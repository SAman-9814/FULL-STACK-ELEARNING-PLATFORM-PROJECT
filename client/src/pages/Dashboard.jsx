import { useState } from "react"
import { VscMenu } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"

function Dashboard() {
  const { loading: profileLoading } = useSelector((state) => state.profile)
  const { loading: authLoading } = useSelector((state) => state.auth)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        {/* Mobile Sidebar Toggle Header */}
        <div className="md:hidden flex items-center justify-between bg-richblack-800 px-6 py-4 border-b border-richblack-700 text-richblack-50">
          <span className="font-semibold text-base">Dashboard Navigation</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-x-1.5 rounded-md border border-richblack-600 bg-richblack-700 px-3 py-1.5 text-xs font-semibold text-richblack-100 hover:bg-richblack-600 active:scale-95 transition-all duration-200"
          >
            <VscMenu className="text-sm" />
            <span>Navigate</span>
          </button>
        </div>

        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
