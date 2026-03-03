import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Login from "./pages/Login"; // IMPORTAR O LOGIN
import Categorias from "./pages/Categorias";
import Fornecedores from "./pages/Fornecedores/index";
import './styles/theme.css';
import Dashboard from "./components/Dashboard";
import Pagamentos from "./components/Pagamentos";
import Convidados from "./components/Convidados";
import Footer from "./components/Footer";

// --- COMPONENTE DE PROTEÇÃO DE ROTA ---
// Se não tiver token, joga o usuário de volta para o Login
const RotaPrivada = ({ children }) => {
    const isAuthenticated = localStorage.getItem('auth_token') !== null;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fbfaf8' }}>
                <Menu />

                <main style={{ flex: 1 }}>
                    <Routes>
                        {/* ROTAS PÚBLICAS */}

                        <Route path="/login" element={<Login />} />
                        {/* <Route path="/rsvp" element={<RSVP />} /> -> Faremos na sequência */}

                        {/* ROTAS PRIVADAS (Envolvidas pelo componente RotaPrivada) */}
                        <Route path="/" element={<RotaPrivada><Home /></RotaPrivada>} />                             
                        <Route path="/dashboard" element={<RotaPrivada><Dashboard /></RotaPrivada>} />
                        <Route path="/categorias" element={<RotaPrivada><Categorias /></RotaPrivada>} />
                        <Route path="/fornecedores" element={<RotaPrivada><Fornecedores /></RotaPrivada>} />
                        <Route path="/pagamentos" element={<RotaPrivada><Pagamentos /></RotaPrivada>} />
                        <Route path="/convidados" element={<RotaPrivada><Convidados /></RotaPrivada>} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;