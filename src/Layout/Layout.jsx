import { Outlet } from 'react-router'
import Navbar from '../Components/Navbar/Navbar'

const Layout = () => {
    return (
        <div className="w-full max-w-[1000px] lg:max-w-[1200px] mx-auto px-6 pb-10">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout