import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react'; // <-- Adicionamos Eye e EyeOff aqui
import logo from 'C:\\WeddingControl\\Front\\wedding-control-web\\src\\assets\\logo.png';
import api from 'C:\\WeddingControl\\Front\\wedding-control-web\\src\\services\\api.js';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    // <-- NOVO ESTADO PARA CONTROLAR O OLHINHO
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { usuario, senha });
            localStorage.setItem('auth_token', response.data.token);
            navigate('/');
        } catch (err) {
            setErro('Usuário ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: "#fbfaf8", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Container className="d-flex justify-content-center">
                <Card className="border-0 shadow-lg" style={{ maxWidth: "400px", width: "100%", padding: "40px", borderRadius: "12px" }}>

                    <div className="text-center mb-4">
                        <img src={logo} alt="Logo" height="45" style={{ filter: "", marginBottom: "20px" }} />
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", color: "#1a1a1a" }}>Acesso Restrito</h2>
                        <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase", margin: 0 }}>
                            Área dos Noivos
                        </p>
                    </div>

                    {erro && <Alert variant="danger" style={{ fontSize: "12px", textAlign: "center", borderRadius: "4px" }}>{erro}</Alert>}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-4 animated-group">
                            <Form.Label className="animated-label" style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", letterSpacing: "1px" }}>
                                USUÁRIO
                            </Form.Label>
                            <div className="animated-input-wrapper">
                                <Form.Control
                                    type="text"
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                    style={{ borderRadius: "0", border: "none", borderBottom: "1px solid #eee", padding: "8px 0", fontSize: "14px", boxShadow: "none", backgroundColor: "transparent" }}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-5 animated-group">
                            <Form.Label className="animated-label" style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", letterSpacing: "1px" }}>
                                SENHA
                            </Form.Label>
                            <div className="animated-input-wrapper">
                                <Form.Control
                                    // <-- AQUI A GENTE TROCA O TIPO DO INPUT COM BASE NO ESTADO
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                    // <-- Adicionei um padding-right de 30px para o texto não ficar por cima do ícone
                                    style={{ borderRadius: "0", border: "none", borderBottom: "1px solid #eee", padding: "8px 30px 8px 0", fontSize: "14px", boxShadow: "none", backgroundColor: "transparent" }}
                                />
                                {/* <-- ÍCONE DO OLHINHO FLUTUANDO À DIREITA */}
                                <div
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    style={{
                                        position: "absolute",
                                        right: "0",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#aaa",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                </div>
                            </div>
                        </Form.Group>

                        <Button
                            type="submit"
                            variant="dark"
                            className="w-100 d-flex justify-content-center align-items-center gap-2"
                            style={{ borderRadius: "4px", fontSize: "12px", padding: "12px", fontWeight: "600", letterSpacing: "1px" }}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : <><Lock size={14} /> ENTRAR</>}
                        </Button>
                    </Form>
                </Card>
            </Container>

            <style>{`
                .form-control:focus { 
                    border-bottom: 1px solid transparent !important; 
                }

                .animated-label {
                    transition: color 0.3s ease;
                }

                .animated-input-wrapper {
                    position: relative;
                    display: block;
                }

                .animated-input-wrapper::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 1.5px;
                    background-color: #c2a36b;
                    transition: width 0.3s ease;
                }

                .animated-group:hover .animated-input-wrapper::after,
                .animated-group:focus-within .animated-input-wrapper::after {
                    width: 100%;
                }

                .animated-group:hover .animated-label,
                .animated-group:focus-within .animated-label {
                    color: #c2a36b !important;
                }
            `}</style>
        </div>
    );
};

export default Login;