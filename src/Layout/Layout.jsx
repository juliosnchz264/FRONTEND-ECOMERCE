import { Outlet } from 'react-router'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import ScrollToTop from '../Components/ui/ScrollToTop';
import { ThemeProvider } from '../Context/ThemeContext'
import SearchBar from '../Components/SearchBar/SearchBar'

const Layout = () => {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Layout