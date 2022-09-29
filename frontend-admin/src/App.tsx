import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import AddFood from './pages/addFood';
import AddIngredient from './pages/addIngredient';
import AddLiquid from './pages/addLiquid';
import AddQuantity from './pages/addQuantity';
import ConfirmOrderId from './pages/confirmOrderId';
import Login from './pages/login';
import Order from './pages/order';
import PrintOrderId from './pages/printOrderId';
import SearchComponent from './pages/searchComponent';
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/order" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/order" element={<Order />} />
                <Route
                    path="/confirm"
                    element={
                        <SearchComponent title="Inserisci l'id dell'ordine da confermare:" />
                    }
                />
                <Route path="/confirm/:orderId" element={<ConfirmOrderId />} />
                <Route
                    path="/print"
                    element={
                        <SearchComponent title="Inserisci l'id dell'ordine da stampare:" />
                    }
                />
                <Route path="/add-ingredient" element={<AddIngredient />} />
                <Route path="/add-liquid" element={<AddLiquid />} />
                <Route path="/add-quantity" element={<AddQuantity />} />
                <Route path="/add-food" element={<AddFood />} />
                <Route path="/print/:orderId" element={<PrintOrderId />} />
                <Route path="*" element={<h1>Pagina non trovata.</h1>} />
            </Routes>
        </>
    );
}

export default App;
