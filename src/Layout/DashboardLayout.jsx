import { Outlet, Link } from 'react-router'

const DashboardLayout = () => {
    return (
        <>
            <div className="navbar bg-base-100 shadow-lg mt-8">
                <div className="dropdown md:hidden">
                    <div
                        tabIndex={0}
                        role="button"
                        className="bnt btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {' '}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />{' '}
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow"
                    >
                        <li>
                            <Link to="/admin/dashboard/products">
                                Productos
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="md:mx-auto hidden md:inline-flex md:gap-4">
                    <Link
                        className="btn btn-primary"
                        to="/admin/dashboard/products"
                    >
                        Productos
                    </Link>
                </div>
            </div>
            <Outlet />
        </>
    )
}

export default DashboardLayout