import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Categorias from "./pages/Categorias";
import Fornecedores from "./pages/Fornecedores/index";
import './styles/theme.css';
import Dashboard from "./components/Dashboard";
import Pagamentos from "./components/Pagamentos";
import Convidados from "./components/Convidados";
import Footer from "./components/Footer";

function App() {
    return (
        <BrowserRouter>
            {/* Usamos uma div com display flex e min-height 100vh 
              para o footer nunca ficar flutuando no meio da tela
            */}
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                backgroundColor: '#fbfaf8' // Fundo padrão leve do seu sistema
            }}>
                <Menu />
                
                {/* O main com flex: 1 empurra o footer para baixo */}
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/categorias" element={<Categorias />} />
                        <Route path="/fornecedores" element={<Fornecedores />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pagamentos" element={<Pagamentos />} />
                        <Route path="/convidados" element={<Convidados />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;