import { useState } from 'react'; // Importar useState
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Menu() {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false); // Estado para controlar o menu no mobile

    const linkStyle = {
        color: "#888",
        fontSize: "0.75rem",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        fontWeight: "600",
        transition: "all 0.3s ease",
        padding: "8px 0"
    };

    const activeLinkStyle = {
        ...linkStyle,
        color: "#c2a36b",
    };

    return (
        <Navbar
            expand="lg"
            sticky="top"
            expanded={expanded} // Vincula o estado ao Navbar
            onToggle={(nextExpanded) => setExpanded(nextExpanded)} // Atualiza o estado ao clicar no botão hambúrguer
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid #f0f0f0",
                paddingTop: "15px",
                paddingBottom: "15px"
            }}
        >
            <Container>
                {/* LOGO */}
                <Navbar.Brand
                    as={Link}
                    to="/"
                    onClick={() => setExpanded(false)} // Fecha ao clicar na logo
                    className="d-flex align-items-center gap-2"
                    style={{ textDecoration: 'none' }}
                >
                    <img
                        src={logo}
                        alt="Wedding Control"
                        height="35"
                    />
                    <span
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.2rem",
                            letterSpacing: "0.5px",

                            fontWeight: "700"
                        }}
                    >
                        Wedding Control
                    </span>
                </Navbar.Brand>

                {/* BOTÃO MOBILE */}
                <Navbar.Toggle aria-controls="menu" className="border-0 shadow-none" />

                <Navbar.Collapse id="menu">
                    <Nav className="ms-auto mt-3 mt-lg-0" style={{ gap: "25px" }}>
                        {[
                            { nome: "Início", path: "/" },
                            { nome: "Dashboard", path: "/dashboard" },
                            { nome: "Pagamentos", path: "/pagamentos" },
                            { nome: "Categorias", path: "/categorias" },
                            { nome: "Fornecedores", path: "/fornecedores" },
                            { nome: "Convidados", path: "/convidados" }
                        ].map((item) => (
                            <Nav.Link
                                as={Link}
                                key={item.path}
                                to={item.path}
                                // O segredo está aqui: fechar o menu ao clicar
                                onClick={() => setExpanded(false)}
                                style={location.pathname === item.path ? activeLinkStyle : linkStyle}
                                className="nav-link-custom"
                                onMouseEnter={(e) => (e.target.style.color = "#c2a36b")}
                                onMouseLeave={(e) => {
                                    if (location.pathname !== item.path) {
                                        e.target.style.color = "#888";
                                    }
                                }}
                            >
                                {item.nome}
                            </Nav.Link>
                        ))}
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <style>{`
                .nav-link-custom {
                    position: relative;
                }
                
                @media (min-width: 992px) {
                    .nav-link-custom::after {
                        content: '';
                        position: absolute;
                        width: 0;
                        height: 1px;
                        bottom: 5px;
                        left: 0;
                        background-color: #c2a36b;
                        transition: width 0.3s ease;
                    }
                    .nav-link-custom:hover::after {
                        width: 100%;
                    }
                }

                .navbar-toggler:focus {
                    box-shadow: none;
                    outline: none;
                }
            `}</style>
        </Navbar>
    );
}

export default Menu;