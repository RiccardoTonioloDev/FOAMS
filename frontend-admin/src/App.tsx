import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';

const AddFood = React.lazy(() => import('./pages/addFood'));
const AddIngredient = React.lazy(() => import('./pages/addIngredient'));
const AddLiquid = React.lazy(() => import('./pages/addLiquid'));
const AddQuantity = React.lazy(() => import('./pages/addQuantity'));
const ConfirmOrderId = React.lazy(() => import('./pages/confirmOrderId'));
const Delete = React.lazy(() => import('./pages/delete'));
const Login = React.lazy(() => import('./pages/login'));
const Order = React.lazy(() => import('./pages/order'));
const PrintOrderId = React.lazy(() => import('./pages/printOrderId'));
const SearchComponent = React.lazy(() => import('./pages/searchComponent'));

function App() {
    return (
        <>
            <Suspense
                fallback={
                    <div>
                        <Spinner role="status" animation="border" />
                    </div>
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/order" replace />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/order" element={<Order />} />
                    <Route
                        path="/confirm"
                        element={
                            <SearchComponent title="Inserisci l'id dell'ordine da confermare:" />
                        }
                    />
                    <Route
                        path="/confirm/:orderId"
                        element={<ConfirmOrderId />}
                    />
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
                    <Route path="/delete" element={<Delete />} />
                    <Route path="/print/:orderId" element={<PrintOrderId />} />
                    <Route path="*" element={<h1>Pagina non trovata.</h1>} />
                </Routes>
            </Suspense>
        </>
    );
}

export default App;
