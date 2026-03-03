/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Container, Row, Col, Tabs, Tab, Spinner
} from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../services/api';

/* ===================== HELPERS ===================== */
const maskPhone = (val) => val ? val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1') : '';
const maskCpf = (val) => val ? val.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1') : '';
const maskCnpj = (val) => val ? val.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d)/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1') : '';
const formatMoney = (val) => (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (ds) => { if (!ds) return '-'; const [a, m, d] = ds.split('T')[0].split('-'); return `${d}/${m}/${a}`; };

const Fornecedores = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [todosPagamentos, setTodosPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dados');

    const [formData, setFormData] = useState({
        id: 0, categoriaId: 0, nome: '', tipoPessoa: 'PJ', email: '', telefone: '', cnpjCpf: '', dataFechamento: '', valorTotal: 0, valorEntrada: 0, fechado: false, observacao: ''
    });

    const [pagamentosModal, setPagamentosModal] = useState([]);
    const [novoPagamento, setNovoPagamento] = useState({ descricao: '', valor: '', dataVencimento: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [cat, forn, pags] = await Promise.all([
                api.get('/categoria'), api.get('/Fornecedor'), api.get('/Pagamento')
            ]);
            setCategorias(cat.data || []);
            setFornecedores(forn.data || []);
            setTodosPagamentos(pags.data || []);
        } catch { setError('Erro ao carregar dados.'); }
        finally { setLoading(false); }
    };

    const calcularFalta = (f) => {
        const pagas = todosPagamentos.filter(p => p.fornecedorId === f.id && p.pago);
        return f.valorTotal - pagas.reduce((acc, p) => acc + p.valor, 0);
    };

    const handleShow = (f = null) => {
        setActiveTab('dados');
        if (f) {
            setFormData({ ...f, dataFechamento: f.dataFechamento ? f.dataFechamento.split('T')[0] : '', tipoPessoa: f.tipoPessoa || 'PJ' });
            loadPagamentosModal(f.id);
        } else {
            setFormData({ id: 0, categoriaId: 0, nome: '', tipoPessoa: 'PJ', email: '', telefone: '', cnpjCpf: '', dataFechamento: '', valorTotal: 0, valorEntrada: 0, fechado: false, observacao: '' });
            setPagamentosModal([]);
        }
        setShowModal(true);
    };

    const loadPagamentosModal = async (id) => {
        const res = await api.get(`/Pagamento/PorFornecedor/${id}`);
        setPagamentosModal(res.data || []);
    };

    const handleSave = async () => {
        const { categoria, ...dadosParaEnvio } = formData;
        const payload = {
            ...dadosParaEnvio,
            categoriaId: parseInt(formData.categoriaId),
            cnpjCpf: formData.cnpjCpf ? formData.cnpjCpf.replace(/\D/g, '') : '',
            valorTotal: parseFloat(formData.valorTotal) || 0,
            dataFechamento: formData.dataFechamento || null
        };

        try {
            if (formData.id === 0) {
                const res = await api.post('/Fornecedor', payload);
                setFormData({ ...formData, id: res.data.id });
                setActiveTab('pagamentos');
            } else {
                await api.put(`/Fornecedor/${formData.id}`, payload);
                setShowModal(false);
            }
            loadData();
        } catch { setError("Falha ao salvar."); }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="secondary" size="sm" /></div>;

    return (
        <Container fluid className="px-3 px-md-5" style={{ maxWidth: "1100px", marginTop: "40px", marginBottom: "80px" }}>
            
            {/* HEADER RESPONSIVO */}
            <div className="mb-5">
                <div className="mb-3">
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "calc(1.8rem + 1vw)", color: "#1a1a1a", marginBottom: "4px" }}>
                        Fornecedores
                    </h1>
                    <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase", margin: 0 }}>
                        Contratos e Parceiros
                    </p>
                </div>
                
                <Button 
                    onClick={() => handleShow()} 
                    className="w-100 w-md-auto"
                    style={{ 
                        backgroundColor: "#1a1a1a", 
                        border: "none", 
                        borderRadius: "4px", 
                        padding: "10px 24px", 
                        fontSize: "11px", 
                        fontWeight: "600", 
                        letterSpacing: "1px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <Plus size={14} className="me-2" /> NOVO FORNECEDOR
                </Button>
            </div>

            {/* LISTA DE FORNECEDORES */}
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
                <div className="table-responsive">
                    <Table borderless className="mb-0">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }}>FORNECEDOR</th>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="d-none d-md-table-cell">FINANCEIRO</th>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-center">STATUS</th>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-end pe-4">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fornecedores.map((f) => {
                                const falta = calcularFalta(f);
                                return (
                                    <tr key={f.id} style={{ borderBottom: "1px solid #f8f8f8" }} className="align-middle">
                                        <td style={{ padding: "16px 20px" }}>
                                            <div style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>{f.nome}</div>
                                            <div style={{ fontSize: "10px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase" }}>
                                                {f.categoria?.nome || 'Geral'}
                                            </div>
                                            <div className="d-md-none mt-1" style={{ fontSize: "11px", color: "#666" }}>
                                                {formatMoney(f.valorTotal)} • <span className={falta <= 0 ? "text-success" : "text-danger"}>{falta <= 0 ? "PAGO" : `FALTA ${formatMoney(falta)}`}</span>
                                            </div>
                                        </td>
                                        <td className="d-none d-md-table-cell" style={{ padding: "16px 20px" }}>
                                            <div style={{ fontSize: "13px", color: "#444", fontWeight: "500" }}>{formatMoney(f.valorTotal)}</div>
                                            <div style={{ fontSize: "10px", color: falta <= 0 ? "#28a745" : "#dc3545", fontWeight: "600" }}>
                                                {falta <= 0 ? "LIQUIDADO" : `PENDENTE: ${formatMoney(falta)}`}
                                            </div>
                                        </td>
                                        <td className="text-center" style={{ padding: "16px 20px" }}>
                                            <div style={{ 
                                                fontSize: "8px", fontWeight: "800", padding: "3px 8px", borderRadius: "2px",
                                                backgroundColor: f.fechado ? "#f5f5f5" : "#fff9f0", color: f.fechado ? "#999" : "#c2a36b", border: f.fechado ? "1px solid #eee" : "1px solid #fbeed5",
                                                display: "inline-block"
                                            }}>
                                                {f.fechado ? "OFF" : "ON"}
                                            </div>
                                        </td>
                                        <td className="text-end pe-4" style={{ padding: "16px 20px" }}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="link" className="text-dark p-1" onClick={() => handleShow(f)}>
                                                    <Pencil size={14} strokeWidth={1.5} />
                                                </Button>
                                                <Button variant="link" className="text-muted p-1" onClick={() => { if (window.confirm('Excluir?')) api.delete(`/Fornecedor/${f.id}`).then(loadData) }}>
                                                    <Trash2 size={14} strokeWidth={1.5} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static" className="px-2">
                <Modal.Body className="p-3 p-md-5">
                    <h4 style={{ fontFamily: "'Playfair Display', serif", marginBottom: "25px", fontSize: "22px" }}>
                        {formData.id === 0 ? 'Registro' : 'Editar'}
                    </h4>
                    
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs mb-4 flex-nowrap overflow-auto">
                        <Tab eventKey="dados" title="DADOS">
                            <Form className="mt-4">
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <div className="d-flex gap-3 mb-2">
                                            <Form.Check type="radio" label={<span style={{ fontSize: "12px" }}>PJ</span>} name="tp" checked={formData.tipoPessoa === 'PJ'} onChange={() => setFormData({ ...formData, tipoPessoa: 'PJ' })} />
                                            <Form.Check type="radio" label={<span style={{ fontSize: "12px" }}>PF</span>} name="tp" checked={formData.tipoPessoa === 'PF'} onChange={() => setFormData({ ...formData, tipoPessoa: 'PF' })} />
                                        </div>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        <Form.Label className="mini-label">NOME</Form.Label>
                                        <Form.Control className="custom-input" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} />
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Label className="mini-label">{formData.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}</Form.Label>
                                        <Form.Control className="custom-input" value={formData.cnpjCpf} onChange={e => setFormData({ ...formData, cnpjCpf: formData.tipoPessoa === 'PF' ? maskCpf(e.target.value) : maskCnpj(e.target.value) })} />
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Label className="mini-label">CATEGORIA</Form.Label>
                                        <Form.Select className="custom-input" value={formData.categoriaId} onChange={e => setFormData({ ...formData, categoriaId: e.target.value })}>
                                            <option value={0}>Selecione...</option>
                                            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Label className="mini-label">TELEFONE</Form.Label>
                                        <Form.Control className="custom-input" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: maskPhone(e.target.value) })} />
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Label className="mini-label">E-MAIL</Form.Label>
                                        <Form.Control type="email" className="custom-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Form.Label className="mini-label">VALOR TOTAL</Form.Label>
                                        <Form.Control type="number" className="custom-input" value={formData.valorTotal} onChange={e => setFormData({ ...formData, valorTotal: e.target.value })} />
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Form.Label className="mini-label">FECHAMENTO</Form.Label>
                                        <Form.Control type="date" className="custom-input" value={formData.dataFechamento} onChange={e => setFormData({ ...formData, dataFechamento: e.target.value })} />
                                    </Col>
                                    <Col xs={12} md={4} className="d-flex align-items-end pb-1">
                                        <Form.Check type="switch" id="fechado-sw" label={<span style={{ fontSize: "12px" }}>Finalizado</span>} checked={formData.fechado} onChange={e => setFormData({ ...formData, fechado: e.target.checked })} />
                                    </Col>
                                </Row>
                                <div className="d-flex flex-column flex-md-row gap-2 mt-5">
                                    <Button variant="dark" className="px-4 py-2" style={{ borderRadius: "4px", fontSize: "11px" }} onClick={handleSave}>SALVAR</Button>
                                    <Button variant="light" className="px-4 py-2" style={{ borderRadius: "4px", fontSize: "11px", border: "1px solid #eee" }} onClick={() => setShowModal(false)}>VOLTAR</Button>
                                </div>
                            </Form>
                        </Tab>
                        
                        <Tab eventKey="pagamentos" title="PAGAMENTOS" disabled={formData.id === 0}>
                            <div className="mt-4">
                                <div className="p-3 mb-4" style={{ backgroundColor: "#fcfcfc", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
                                    <Row className="g-3">
                                        {/* xs=12 faz com que ocule 100% da tela no mobile */}
                                        <Col xs={12} md={4}>
                                            <Form.Control 
                                                placeholder="Descrição (Ex: Sinal)" 
                                                className="custom-input" 
                                                value={novoPagamento.descricao} 
                                                onChange={e => setNovoPagamento({ ...novoPagamento, descricao: e.target.value })} 
                                            />
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Form.Control 
                                                type="date" 
                                                className="custom-input text-muted" 
                                                value={novoPagamento.dataVencimento} 
                                                onChange={e => setNovoPagamento({ ...novoPagamento, dataVencimento: e.target.value })} 
                                            />
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="Valor (R$)" 
                                                className="custom-input" 
                                                value={novoPagamento.valor} 
                                                onChange={e => setNovoPagamento({ ...novoPagamento, valor: e.target.value })} 
                                            />
                                        </Col>
                                        <Col xs={12} md={2}>
                                            <Button 
                                                variant="dark" 
                                                className="w-100" 
                                                style={{ fontSize: "11px", padding: "10px", borderRadius: "4px" }} 
                                                onClick={() => { 
                                                    api.post('/Pagamento', { 
                                                        ...novoPagamento, 
                                                        fornecedorId: formData.id, 
                                                        valor: parseFloat(novoPagamento.valor) || 0, 
                                                        pago: false 
                                                    }).then(() => { 
                                                        setNovoPagamento({ descricao: '', valor: '', dataVencimento: '' }); 
                                                        loadPagamentosModal(formData.id); 
                                                        loadData(); 
                                                    }) 
                                                }}
                                            >
                                                ADD
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                                
                                <div className="table-responsive">
                                    <Table size="sm" borderless style={{ minWidth: "300px" }}>
                                        <thead>
                                            <tr style={{ fontSize: "8px", color: "#aaa", letterSpacing: "1px", borderBottom: "1px solid #eee" }}>
                                                <th>VENCIMENTO</th>
                                                <th>DESCRIÇÃO</th>
                                                <th>VALOR</th>
                                                <th className="text-center">PAGO</th>
                                                <th className="text-end">AÇÃO</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pagamentosModal.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-4 text-muted small">Nenhum pagamento registrado</td></tr>
                                            ) : (
                                                pagamentosModal.map(p => (
                                                    <tr key={p.id} className="align-middle" style={{ borderBottom: "1px solid #f8f8f8" }}>
                                                        <td style={{ fontSize: "11px", padding: "12px 0" }}>{formatDate(p.dataVencimento)}</td>
                                                        <td style={{ fontSize: "11px" }}>{p.descricao}</td>
                                                        <td style={{ fontSize: "11px", fontWeight: "600", color: "#c2a36b" }}>{formatMoney(p.valor)}</td>
                                                        <td className="text-center">
                                                            <Form.Check 
                                                                type="checkbox" 
                                                                checked={p.pago} 
                                                                onChange={() => api.put(`/Pagamento/${p.id}`, { ...p, pago: !p.pago }).then(() => { loadPagamentosModal(formData.id); loadData(); })} 
                                                            />
                                                        </td>
                                                        <td className="text-end">
                                                            <Button variant="link" className="text-danger p-0" onClick={() => api.delete(`/Pagamento/${p.id}`).then(() => { loadPagamentosModal(formData.id); loadData(); })}>
                                                                <Trash2 size={13} strokeWidth={1.5} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>

            <style>{`
                .mini-label { fontSize: 9px; fontWeight: 700; color: #aaa; letterSpacing: 1px; }
                .custom-tabs .nav-link { color: #ccc; border: none; font-weight: 700; font-size: 0.65rem; letter-spacing: 1.2px; padding: 10px 0; margin-right: 20px; transition: 0.3s; white-space: nowrap; }
                .custom-tabs .nav-link.active { color: #1a1a1a !important; background: transparent !important; border-bottom: 2px solid #c2a36b !important; }
                .custom-input { border: none !important; border-bottom: 1px solid #eee !important; border-radius: 0 !important; padding: 8px 0 !important; fontSize: 13px !important; box-shadow: none !important; background: transparent !important; }
                .custom-input:focus { border-bottom: 1px solid #c2a36b !important; }
                @media (max-width: 576px) {
                    .px-3 { padding-left: 15px !important; padding-right: 15px !important; }
                }
            `}</style>
        </Container>
    );
};

export default Fornecedores;