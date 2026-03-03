import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Spinner } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import api from '../services/api';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({
        totalContratado: 0,
        totalPago: 0,
        totalPendente: 0,
        percentualPago: 0,
        qtdFornecedores: 0
    });
    const [dadosCategoria, setDadosCategoria] = useState([]);
    const [dadosStatus, setDadosStatus] = useState([]);

    // PALETA DE CORES SOFISTICADA
    const COLORS = ['#1a1a1a', '#c2a36b', '#f2f2f2'];
    const GOLD_COLOR = '#c2a36b';
    const DARK_COLOR = '#1a1a1a';

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [resForn, resPag] = await Promise.all([
                api.get('/Fornecedor'),
                api.get('/Pagamento')
            ]);
            processarIndicadores(resForn.data || [], resPag.data || []);
            processarGraficos(resForn.data || []);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar dashboard", error);
            setLoading(false);
        }
    };

    const processarIndicadores = (fornecedores, pagamentos) => {
        const fornecedoresFechados = fornecedores.filter(f => f.fechado);
        const totalContratado = fornecedoresFechados.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
        const totalPago = pagamentos.filter(p => p.pago).reduce((acc, p) => acc + p.valor, 0);
        const totalPendente = totalContratado - totalPago;

        setKpis({
            totalContratado,
            totalPago,
            totalPendente: totalPendente < 0 ? 0 : totalPendente,
            percentualPago: totalContratado > 0 ? ((totalPago / totalContratado) * 100).toFixed(1) : 0,
            qtdFornecedores: fornecedores.length
        });
    };

    const processarGraficos = (lista) => {
        const fechados = lista.filter(f => f.fechado);
        const porCategoria = fechados.reduce((acc, item) => {
            const catNome = item.categoria?.nome || 'Outros';
            acc[catNome] = (acc[catNome] || 0) + item.valorTotal;
            return acc;
        }, {});

        const arrayCategoria = Object.keys(porCategoria).map(key => ({
            name: key,
            Valor: porCategoria[key]
        }));
        setDadosCategoria(arrayCategoria);

        const qtdFechados = lista.filter(i => i.fechado).length;
        const qtdAbertos = lista.length - qtdFechados;

        setDadosStatus([
            { name: 'Fechados', value: qtdFechados },
            { name: 'Em Aberto', value: qtdAbertos }
        ]);
    };

    const formatMoney = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Componente de Indicador Minimalista
    const Metric = ({ label, value, color = DARK_COLOR, goldLine = false }) => (
        <div className="mb-4 mb-md-0" style={{ borderLeft: `1px solid ${goldLine ? GOLD_COLOR : '#eee'}`, paddingLeft: '20px' }}>
            <div style={{ fontSize: '9px', color: '#aaa', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: 'calc(1.2rem + 0.5vw)', color: color, fontFamily: "'Playfair Display', serif", fontWeight: '600' }}>{value}</div>
        </div>
    );

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="secondary" size="sm" /></div>;

    return (
        <Container fluid className="px-3 px-md-5" style={{ backgroundColor: '#fbfaf8', minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
            
            {/* HEADER */}
            <div className="mb-5">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "calc(1.8rem + 1vw)", color: "#1a1a1a", marginBottom: "4px" }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase", margin: 0 }}>
                    Resumo Financeiro do Evento
                </p>
            </div>

            {/* --- INDICADORES (KPIs) --- */}
            <Row className="mb-5 g-4">
                <Col xs={12} md={3}>
                    <Metric label="Total Contratado" value={formatMoney(kpis.totalContratado)} />
                </Col>
                <Col xs={6} md={3}>
                    <Metric label="Já Pago" value={formatMoney(kpis.totalPago)} color={GOLD_COLOR} goldLine />
                </Col>
                <Col xs={6} md={3}>
                    <Metric label="Saldo Devedor" value={formatMoney(kpis.totalPendente)} color="#dc3545" />
                </Col>
                <Col xs={12} md={3}>
                    <div className="mt-2">
                        <div style={{ fontSize: '9px', color: '#aaa', fontWeight: '700', letterSpacing: '1px', marginBottom: '8px' }}>PROGRESSO {kpis.percentualPago}%</div>
                        <ProgressBar now={kpis.percentualPago} style={{ height: '4px', backgroundColor: '#eee', borderRadius: '0' }} />
                        <style type="text/css">{` .progress-bar { background-color: ${GOLD_COLOR} !important; } `}</style>
                    </div>
                </Col>
            </Row>

            {/* --- GRÁFICOS --- */}
            <Row className="g-5">
                {/* Gráfico de Barras - Moderno */}
                <Col xs={12} lg={8}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                        <h6 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '30px' }}>Investimento por Categoria</h6>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dadosCategoria}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8f8f8" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#bbb', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#bbb', fontSize: 10 }} tickFormatter={(val) => `R$${val/1000}k`} />
                                <Tooltip cursor={{ fill: '#fbfaf8' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }} />
                                <Bar dataKey="Valor" fill={GOLD_COLOR} radius={[2, 2, 0, 0]} barSize={35} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                {/* Gráfico de Pizza - Moderno */}
                <Col xs={12} lg={4}>
                    <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #f0f0f0', height: '100%' }}>
                        <h6 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '30px' }}>Status dos Contratos</h6>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={dadosStatus} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                                    {dadosStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="text-center mt-4" style={{ fontSize: '11px', color: '#ccc', letterSpacing: '1px' }}>
                            {kpis.qtdFornecedores} FORNECEDORES NO TOTAL
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Rodapé Decorativo */}
            <div className="mt-5 pt-5 text-center" style={{ color: "#ddd", fontStyle: "italic", fontSize: "12px" }}>
                "E, sobre tudo isto, revesti-vos de amor, que é o vínculo da perfeição.
Colossenses 3:14"
            </div>
        </Container>
    );
};

export default Dashboard;