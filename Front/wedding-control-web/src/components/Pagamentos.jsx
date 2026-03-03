import { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Table,
    Form, Button, Badge, Spinner, Alert
} from 'react-bootstrap';
import api from '../services/api';

// --- HELPERS ---
const formatMoney = (val) =>
    (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const [ano, mes, dia] = dateString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
};

const Pagamentos = () => {

    const [loading, setLoading] = useState(true);
    const [todosPagamentos, setTodosPagamentos] = useState([]);
    const [mapFornecedores, setMapFornecedores] = useState({});

    const [dataReferencia, setDataReferencia] = useState(new Date());
    const [pagamentosFiltrados, setPagamentosFiltrados] = useState([]);
    const [resumo, setResumo] = useState({ total: 0, pago: 0, pendente: 0 });

    useEffect(() => {
        carregarDados();
    }, []);

    useEffect(() => {
        filtrarPorMes();
    }, [dataReferencia, todosPagamentos]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const [respForn, respPag] = await Promise.all([
                api.get('/Fornecedor'),
                api.get('/Pagamento')
            ]);
            const map = {};
            (respForn.data || []).forEach(f => map[f.id] = f.nome);
            setMapFornecedores(map);
            setTodosPagamentos(respPag.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtrarPorMes = () => {
        const mes = dataReferencia.getMonth();
        const ano = dataReferencia.getFullYear();

        const filtrados = todosPagamentos
            .filter(p => {
                const d = new Date(p.dataVencimento);
                return d.getMonth() === mes && d.getFullYear() === ano;
            })
            .sort((a, b) =>
                new Date(a.dataVencimento) - new Date(b.dataVencimento)
            );

        setPagamentosFiltrados(filtrados);

        const total = filtrados.reduce((acc, p) => acc + p.valor, 0);
        const pago = filtrados.reduce((acc, p) => acc + (p.pago ? p.valor : 0), 0);

        setResumo({
            total,
            pago,
            pendente: total - pago
        });
    };

    const mudarMes = (dir) => {
        const nova = new Date(dataReferencia);
        nova.setMonth(nova.getMonth() + dir);
        setDataReferencia(nova);
    };

    const handleTogglePago = async (pagamento) => {
        await api.put(`/Pagamento/${pagamento.id}`, {
            ...pagamento,
            pago: !pagamento.pago
        });

        setTodosPagamentos(prev =>
            prev.map(p =>
                p.id === pagamento.id
                    ? { ...p, pago: !p.pago }
                    : p
            )
        );
    };

    const SummaryCard = ({ title, value, highlight }) => (
        <Card
            className="border-0 h-100 shadow-sm"
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px"
            }}
        >
            <Card.Body className="text-center py-3 py-md-4">
                <div
                    style={{
                        fontSize: "10px",
                        letterSpacing: "2px",
                        color: "#888",
                        marginBottom: "6px"
                    }}
                >
                    {title.toUpperCase()}
                </div>
                <div
                    style={{
                        fontSize: "calc(1.2rem + 0.5vw)",
                        fontWeight: "600",
                        fontFamily: "Playfair Display, serif",
                        color: highlight ? "#c2a36b" : "#2c2c2c"
                    }}
                >
                    {formatMoney(value)}
                </div>
            </Card.Body>
        </Card>
    );

    const getRowStyle = (p) => {
        if (p.pago) return { opacity: 0.55 };
        const hoje = new Date().setHours(0, 0, 0, 0);
        const venc = new Date(p.dataVencimento);
        if (venc < hoje) return { backgroundColor: "#fff8f8" };
        return {};
    };

    return (
        <Container
            fluid
            className="px-3 px-md-5"
            style={{
                maxWidth: "1100px",
                paddingTop: "40px",
                paddingBottom: "60px"
            }}
        >

            {/* HEADER ADAPTÁVEL */}
            <div className="text-center mb-4 mb-md-5">
                <h1
                    style={{
                        fontFamily: "Playfair Display, serif",
                        fontSize: "calc(1.8rem + 1vw)",
                        marginBottom: "8px",
                        color: "#2c2c2c"
                    }}
                >
                    Pagamentos
                </h1>
                <div
                    style={{
                        color: "#999",
                        letterSpacing: "2px",
                        fontSize: "11px"
                    }}
                >
                    CONTROLE FINANCEIRO
                </div>
            </div>

            {/* SELETOR DE MÊS */}
            <div className="d-flex justify-content-center mb-4 mb-md-5">
                <div
                    className="d-flex align-items-center"
                    style={{
                        backgroundColor: "#fff",
                        padding: "5px 15px",
                        borderRadius: "100px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                    }}
                >
                    <Button variant="link" className="text-dark p-2" onClick={() => mudarMes(-1)}>‹</Button>
                    <span
                        className="text-nowrap"
                        style={{
                            margin: "0 10px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            fontSize: "12px"
                        }}
                    >
                        {dataReferencia.toLocaleDateString('pt-BR', {
                            month: 'short',
                            year: 'numeric'
                        }).toUpperCase()}
                    </span>
                    <Button variant="link" className="text-dark p-2" onClick={() => mudarMes(1)}>›</Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" style={{ color: "#c2a36b" }} />
                </div>
            ) : (
                <>
                    {/* KPIs RESPONSIVOS: 1 por linha no mobile, 3 no PC */}
                    <Row className="mb-4 mb-md-5 g-3">
                        <Col xs={12} md={4}>
                            <SummaryCard title="Total" value={resumo.total} />
                        </Col>
                        <Col xs={12} md={4}>
                            <SummaryCard title="Pago" value={resumo.pago} highlight />
                        </Col>
                        <Col xs={12} md={4}>
                            <SummaryCard title="Pendente" value={resumo.pendente} />
                        </Col>
                    </Row>

                    {/* TABELA COM SCROLL PARA CELULAR */}
                    <Card
                        className="border-0 shadow-sm"
                        style={{
                            borderRadius: "16px",
                            overflow: "hidden"
                        }}
                    >
                        <div className="table-responsive">
                            <Table hover className="mb-0 align-middle">
                                <thead style={{ backgroundColor: "#fafafa", fontSize: "11px", letterSpacing: "1px", color: "#777" }}>
                                    <tr>
                                        <th className="ps-4 py-3">VENCIMENTO</th>
                                        <th className="py-3">FORNECEDOR</th>
                                        <th className="py-3">DESCRIÇÃO</th>
                                        <th className="py-3">VALOR</th>
                                        <th className="text-center pe-4">PAGO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagamentosFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted small">
                                                Nenhum pagamento neste mês
                                            </td>
                                        </tr>
                                    ) : (
                                        pagamentosFiltrados.map(p => (
                                            <tr key={p.id} style={getRowStyle(p)}>
                                                <td className="ps-4 text-nowrap small">
                                                    {formatDate(p.dataVencimento)}
                                                    {!p.pago && new Date(p.dataVencimento) < new Date().setHours(0, 0, 0, 0) && (
                                                        <Badge bg="danger" className="ms-1" style={{fontSize: '9px'}}>!</Badge>
                                                    )}
                                                </td>
                                                <td className="text-nowrap fw-medium" style={{fontSize: '14px'}}>{mapFornecedores[p.fornecedorId] || "-"}</td>
                                                <td className="small" style={{minWidth: '150px'}}>{p.descricao}</td>
                                                <td className="fw-bold text-nowrap">{formatMoney(p.valor)}</td>
                                                <td className="text-center pe-4">
                                                    <Form.Check
                                                        checked={p.pago}
                                                        onChange={() => handleTogglePago(p)}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>

                    <Alert
                        variant="light"
                        className="mt-5 text-center border-0"
                        style={{ color: "#ccc", fontSize: "12px", fontStyle: "italic" }}
                    >
                        "Deus proverá todas as vossas necessidades."
                    </Alert>
                </>
            )}
        </Container>
    );
};

export default Pagamentos;