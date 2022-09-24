import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import ConfirmOrderId from './components/pages/confirmOrderId';
import Order from './components/pages/order';
function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/order" replace />} />
                <Route path="/order" element={<Order />} />
                <Route path="/confirm" element={<div>Confirm</div>} />
                <Route path="/confirm/:orderId" element={<ConfirmOrderId />} />
                <Route path="/stampa" element={<div>Stampa</div>} />
            </Routes>
        </>
    );
}

export default App;