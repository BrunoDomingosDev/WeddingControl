import { Container } from "react-bootstrap";
import { Heart } from "lucide-react";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{ 
            backgroundColor: "#ffffff", 
            borderTop: "1px solid #f0f0f0", 
            padding: "40px 0",
            marginTop: "auto" // Garante que fique no fim se usar Flexbox no App
        }}>
            <Container className="text-center">
                {/* ÍCONE DISCRETO */}
                <div className="mb-3">
                    <Heart size={16} strokeWidth={1.5} color="#c2a36b" fill="#c2a36b" style={{ opacity: 0.6 }} />
                </div>

                {/* TEXTO PRINCIPAL */}
                <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    color: "#1a1a1a",
                    marginBottom: "8px"
                }}>
                    Bruno <span style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "0.9em", color: "#c2a36b" }}>&</span> Jackeline
                </div>

                {/* DATA E COPYRIGHT */}
                <div style={{
                    fontSize: "0.65rem",
                    letterSpacing: "2px",
                    color: "#aaa",
                    fontWeight: "600",
                    textTransform: "uppercase"
                }}>
                    01.12.2026 • Wedding Control © {currentYear}
                </div>

                {/* FRASE DE RODAPÉ */}
                <div style={{
                    marginTop: "20px",
                    fontSize: "10px",
                    fontStyle: "italic",
                    color: "#ddd",
                    letterSpacing: "1px"
                }}>
                    Feito com amor para o nosso grande dia
                </div>
            </Container>
        </footer>
    );
}

export default Footer;