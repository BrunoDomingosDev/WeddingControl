import { useState } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Menu() {
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    const isLoginPage = location.pathname === "/login";

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
            expanded={expanded}
            onToggle={(nextExpanded) => setExpanded(nextExpanded)}
            style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid #f0f0f0",
                paddingTop: "15px",
                paddingBottom: "15px"
            }}
        >
            <Container className={isLoginPage ? "justify-content-center" : ""}>
                {/* LOGO E TÍTULO */}
                <Navbar.Brand
                    as={Link}
                    to="/"
                    onClick={() => setExpanded(false)}
                    className={`d-flex align-items-center gap-2 ${isLoginPage ? "mx-0" : ""}`}
                    style={{
                        textDecoration: 'none',
                        // Se for login, garante que o Brand não tenha margens laterais automáticas do Bootstrap
                        flex: isLoginPage ? "none" : ""
                    }}
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
                            fontWeight: "700",
                            color: "#1a1a1a"
                        }}
                    >
                        Wedding Control
                    </span>
                </Navbar.Brand>

                {/* SÓ MOSTRA LINKS E BOTÃO SE NÃO FOR LOGIN */}
                {!isLoginPage && (
                    <>
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
                                        onClick={() => setExpanded(false)}
                                        style={location.pathname === item.path ? activeLinkStyle : linkStyle}
                                        className="nav-link-custom"
                                    >
                                        {item.nome}
                                    </Nav.Link>
                                ))}
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>

            <style>{`
                .nav-link-custom { position: relative; }
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
                    .nav-link-custom:hover::after { width: 100%; }
                }
                .navbar-toggler:focus { box-shadow: none; outline: none; }
            `}</style>
        </Navbar>
    );
}

export default Menu;