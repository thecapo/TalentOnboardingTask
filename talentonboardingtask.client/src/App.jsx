import './App.css';
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Stores } from './pages/Stores';
import { Sales } from './pages/Sales';

function App() {

    return (
        <div>
            <nav className="bg-black text-center p-[1rem] flex flex-row justify-start gap-[40px] items-center">
                <div className="text-[18px] text-white font-bold" to="/">React</div>
                <NavLink to="/customers">Customers</NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/stores">Stores</NavLink>
                <NavLink to="/sales">Sales</NavLink>
            </nav>

            <Routes>
                <Route path="/" element={<Navigate to="/customers" />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/sales" element={<Sales />} />
            </Routes>
        </div>
    )
}

export default App;