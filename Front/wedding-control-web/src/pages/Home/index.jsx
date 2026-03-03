import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import casalImg from "../../assets/pagini.png";

function Home() {
    const targetDate = new Date("2026-12-01T00:00:00"); // Ajustado para 01 de Dezembro conforme seu texto

    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate - now;

        if (difference <= 0) {
            return { dias: 0, horas: 0, minutos: 0, segundos: 0 };
        }

        return {
            dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
            horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutos: Math.floor((difference / 1000 / 60) % 60),
            segundos: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeBox = ({ value, label }) => (
        <Col xs={6} md={3} className="mb-4">
            <div style={{ padding: '10px' }}>
                <div
                    style={{
                        fontSize: "calc(2rem + 1vw)",
                        fontWeight: "300",
                        fontFamily: "'Playfair Display', serif",
                        color: "#1a1a1a",
                        lineHeight: "1"
                    }}
                >
                    {String(value).padStart(2, '0')}
                </div>
                <div
                    style={{
                        fontSize: "0.65rem",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: "#c2a36b",
                        fontWeight: "700",
                        marginTop: "8px"
                    }}
                >
                    {label}
                </div>
            </div>
        </Col>
    );

    return (
        <div style={{ background: "#fbfaf8", minHeight: "100vh", paddingBottom: "80px" }}>
            <Container className="pt-5 text-center" style={{ maxWidth: "900px" }}>

                {/* TÍTULO E DATA */}
                <div className="mb-5">
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "calc(2.2rem + 1.5vw)",
                            fontWeight: "500",
                            letterSpacing: "1px",
                            color: "#1a1a1a",
                            marginBottom: "10px"
                        }}
                    >
                        Bruno <span style={{ fontStyle: "italic", fontFamily: "serif", fontSize: "0.9em", color: "#c2a36b" }}>&</span> Jackeline
                    </h1>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '20px',
                        color: "#c2a36b",
                        fontSize: "0.9rem",
                        letterSpacing: "2px",
                        fontWeight: "500"
                    }}>
                        <div style={{ height: '1px', width: '30px', background: '#e0e0e0' }} />
                        01 DE DEZEMBRO DE 2026
                        <div style={{ height: '1px', width: '30px', background: '#e0e0e0' }} />
                    </div>
                </div>

                {/* IMAGEM PRINCIPAL - FORMATO BOUTIQUE */}
                <div className="mb-5 px-2">
                    <div
                        style={{
                            width: "100%",
                            height: "500px",
                            borderRadius: "4px", // Bordas mais retas passam mais elegância
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.05)"
                        }}
                    >
                        <img
                            src={casalImg}
                            alt="Bruno e Jackeline"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center 20%"
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to bottom, transparent 80%, rgba(251, 250, 248, 0.8))"
                            }}
                        />
                    </div>
                </div>

                {/* CONTAGEM REGRESSIVA */}
                <div className="mt-5">
                    <div
                        style={{
                            letterSpacing: "4px",
                            fontSize: "0.7rem",
                            color: "#aaa",
                            fontWeight: "700",
                            marginBottom: "30px"
                        }}
                    >
                        A CONTAGEM REGRESSIVA COMEÇA
                    </div>

                    <Row className="justify-content-center mx-auto" style={{ maxWidth: "600px" }}>
                        <TimeBox value={timeLeft.dias} label="Dias" />
                        <TimeBox value={timeLeft.horas} label="Horas" />
                        <TimeBox value={timeLeft.minutos} label="Minutos" />
                        <TimeBox value={timeLeft.segundos} label="Segundos" />
                    </Row>
                </div>

                {/* MENSAGEM FINAL ADAPTÁVEL */}
                {new Date() > targetDate ? (
                    <div style={{ marginTop: "40px", animation: "fadeIn 2s ease" }}>
                        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#c2a36b" }}>
                            O grande dia chegou! 🤍
                        </p>
                    </div>
                ) : (
                    <div style={{ marginTop: "50px", opacity: 0.4 }}>
                        <p style={{ fontSize: "0.8rem", letterSpacing: "1px", color: "#666" }}>
                            " A caridade é sofredora, é benigna; a caridade não é invejosa; a caridade não trata com leviandade, não se ensoberbece, não se porta com indecência, não busca os seus interesses, não se irrita, não suspeita mal; não folga com a injustiça, mas folga com a verdade; tudo sofre, tudo crê, tudo espera, tudo suporta."
                        </p>
                    </div>
                )}

            </Container>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default Home;