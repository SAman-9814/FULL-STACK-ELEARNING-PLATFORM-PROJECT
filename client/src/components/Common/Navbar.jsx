import { useEffect, useState } from "react"
import { AiOutlineClose, AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { logout } from "../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        // console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="auto-w-max invisible absolute left-[50%] top-[50%] z-[1000] flex translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {subLinks.length ? (
                          <>
                            {subLinks.map((subLink, i) => (
                              <Link
                                to={`/catalog/${subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="whitespace-nowrap rounded-lg bg-transparent px-4 py-4 hover:bg-richblack-50"
                                key={i}
                              >
                                <p>{subLink.name}</p>
                              </Link>
                            ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>
        <button className="mr-4 md:hidden" onClick={() => setMobileMenuOpen(true)}>
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop Overlay with blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div className="relative w-[280px] h-full bg-richblack-900 border-l border-richblack-800 p-6 flex flex-col justify-between shadow-2xl animate-slide-in-right z-10">
            <div className="flex flex-col gap-y-6 overflow-y-auto max-h-[85vh]">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-richblack-800 pb-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src={logo} alt="Logo" width={130} height={26} loading="lazy" />
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-richblack-100 hover:text-richblack-5">
                  <AiOutlineClose fontSize={24} />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex flex-col">
                <ul className="flex flex-col gap-y-4 text-richblack-100 font-medium">
                  {NavbarLinks.map((link, index) => (
                    <li key={index} className="border-b border-richblack-800/30 pb-2">
                      {link.title === "Catalog" ? (
                        <div className="flex flex-col">
                          <button
                            onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                            className={`flex w-full items-center justify-between py-1 text-left ${
                              matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"
                            }`}
                          >
                            <span>{link.title}</span>
                            <BsChevronDown className={`transform transition-transform duration-200 ${mobileCatalogOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          {/* Sublinks Accordion */}
                          {mobileCatalogOpen && (
                            <div className="mt-2 pl-4 flex flex-col gap-y-2 border-l border-richblack-700 bg-richblack-900/50 rounded-lg animate-slide-down">
                              {loading ? (
                                <p className="text-xs text-richblack-400 py-1">Loading...</p>
                              ) : subLinks.length ? (
                                subLinks.map((subLink, i) => (
                                  <Link
                                    to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm py-2 text-richblack-25 hover:text-yellow-25 transition-colors duration-150"
                                    key={i}
                                  >
                                    {subLink.name}
                                  </Link>
                                ))
                              ) : (
                                <p className="text-sm text-richblack-400 py-2">No Courses Found</p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={link?.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`${
                            matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"
                          } block py-1 hover:text-yellow-25 transition-colors duration-150`}
                        >
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Bottom Actions: User profile or login/signup */}
            <div className="border-t border-richblack-800 pt-4 mt-auto">
              {token !== null ? (
                <div className="flex flex-col gap-y-4">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-x-3 bg-richblack-800/40 p-3 rounded-lg border border-richblack-800">
                    <img
                      src={user?.image}
                      alt={`profile-${user?.firstName}`}
                      className="aspect-square w-[40px] rounded-full object-cover border border-richblack-600"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <p className="text-sm font-semibold text-richblack-25 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-richblack-400 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    to="/dashboard/my-profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-x-2 rounded-lg bg-richblack-800 px-4 py-2.5 text-sm font-medium text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200"
                  >
                    <VscDashboard className="text-lg" />
                    <span>Dashboard</span>
                  </Link>

                  {/* Cart Link (if student) */}
                  {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <Link
                      to="/dashboard/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-between rounded-lg bg-richblack-800 px-4 py-2.5 text-sm font-medium text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200"
                    >
                      <div className="flex items-center gap-x-2">
                        <AiOutlineShoppingCart className="text-lg" />
                        <span>Cart</span>
                      </div>
                      {totalItems > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-richblack-900">
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Logout Action */}
                  <button
                    onClick={() => {
                      dispatch(logout(navigate))
                      setMobileMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-x-2 rounded-lg border border-pink-200 bg-pink-900/10 px-4 py-2.5 text-sm font-medium text-pink-200 hover:bg-pink-900/30 transition-all duration-200"
                  >
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-y-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[10px] text-center text-sm font-medium text-richblack-100 hover:bg-richblack-700 transition-colors duration-200">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full rounded-[8px] bg-yellow-50 px-[12px] py-[10px] text-center text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition-colors duration-200 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
