import { useState, useEffect } from 'react';
import { Container, Table, Form, Button, Spinner, Modal, Row, Col } from 'react-bootstrap';
import { Pencil, Trash2, Plus, Users, Ticket } from 'lucide-react'; 
import api from '../services/api';

const Convidados = () => {
    const [loading, setLoading] = useState(true);
    const [convidados, setConvidados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: 0, nome: '', quantidadePessoas: 1 });

    useEffect(() => { carregarDados(); }, []);

    const carregarDados = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Convidados');
            setConvidados(response.data || []);
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!formData.nome.trim()) return;
        const payload = { Nome: formData.nome, QuantidadePessoas: parseInt(formData.quantidadePessoas) };
        
        try {
            if (formData.id === 0) await api.post('/Convidados', payload);
            else await api.put(`/Convidados/${formData.id}`, { ...payload, Id: formData.id });
            setShowModal(false);
            carregarDados();
        } catch { alert("Erro ao salvar"); }
    };

    // Cálculos para o Dashboard
    const totalConvites = convidados.length;
    const totalPessoas = convidados.reduce((acc, curr) => acc + (curr.quantidadePessoas || 0), 0);

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="secondary" size="sm" /></div>;

    return (
        <Container fluid className="px-3 px-md-5" style={{ maxWidth: "1000px", marginTop: "40px", marginBottom: "80px" }}>
            
            {/* HEADER */}
            <div className="mb-5">
                <div className="mb-4">
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "calc(1.8rem + 1vw)", color: "#1a1a1a", marginBottom: "4px" }}>
                        Convidados
                    </h1>
                    <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase", margin: 0 }}>
                        Lista de Presença
                    </p>
                </div>

                {/* DASHBOARD MINI REFINADO */}
                <Row className="mb-4 g-3">
                    <Col xs={6} md={3}>
                        <div style={{ borderLeft: "1px solid #eee", paddingLeft: "15px" }}>
                            <div style={{ fontSize: "9px", color: "#aaa", fontWeight: "700", letterSpacing: "1px" }}>TOTAL CONVITES</div>
                            <div style={{ fontSize: "20px", color: "#1a1a1a", fontWeight: "500", fontFamily: "'Playfair Display', serif" }}>
                                {totalConvites}
                            </div>
                        </div>
                    </Col>
                    <Col xs={6} md={3}>
                        <div style={{ borderLeft: "1px solid #c2a36b", paddingLeft: "15px" }}>
                            <div style={{ fontSize: "9px", color: "#c2a36b", fontWeight: "700", letterSpacing: "1px" }}>TOTAL PESSOAS</div>
                            <div style={{ fontSize: "20px", color: "#1a1a1a", fontWeight: "500", fontFamily: "'Playfair Display', serif" }}>
                                {totalPessoas}
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Button 
                    onClick={() => { setFormData({ id: 0, nome: '', quantidadePessoas: 1 }); setShowModal(true); }} 
                    className="w-100 w-md-auto"
                    style={{ backgroundColor: "#1a1a1a", border: "none", borderRadius: "4px", padding: "10px 24px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <Plus size={14} className="me-2" /> NOVO CONVITE
                </Button>
            </div>

            {/* LISTA */}
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
                <div className="table-responsive">
                    <Table borderless className="mb-0">
                        <thead>
                            <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }}>NOME / FAMÍLIA</th>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-center d-none d-md-table-cell">QUANTIDADE</th>
                                <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-end">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {convidados.length === 0 ? (
                                <tr><td colSpan="3" className="text-center py-5" style={{ fontSize: "12px", color: "#ccc" }}>Nenhum convidado na lista</td></tr>
                            ) : (
                                convidados.map(c => (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #f8f8f8" }} className="align-middle">
                                        <td style={{ padding: "16px 20px" }}>
                                            <div style={{ fontSize: "14px", color: "#1a1a1a", fontWeight: "500" }}>{c.nome}</div>
                                            <div className="d-md-none mt-1">
                                                <span style={{ fontSize: "10px", color: "#c2a36b", fontWeight: "700" }}>
                                                    {c.quantidadePessoas} {c.quantidadePessoas === 1 ? 'PESSOA' : 'PESSOAS'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="text-center d-none d-md-table-cell" style={{ padding: "16px 20px" }}>
                                            <span style={{ 
                                                fontSize: "10px", fontWeight: "700", padding: "4px 12px", borderRadius: "2px",
                                                backgroundColor: "rgba(194, 163, 107, 0.05)", color: "#c2a36b", border: "1px solid #fbeed5"
                                            }}>
                                                {c.quantidadePessoas} {c.quantidadePessoas === 1 ? 'pessoa' : 'pessoas'}
                                            </span>
                                        </td>
                                        <td className="text-end" style={{ padding: "16px 20px" }}>
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button variant="link" className="text-dark p-1" onClick={() => { setFormData(c); setShowModal(true); }}>
                                                    <Pencil size={14} strokeWidth={1.5} />
                                                </Button>
                                                <Button variant="link" className="text-muted p-1" onClick={() => { if (window.confirm('Excluir?')) api.delete(`/Convidados/${c.id}`).then(carregarDados) }}>
                                                    <Trash2 size={14} strokeWidth={1.5} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
                <Modal.Body className="p-4">
                    <h5 style={{ fontFamily: "'Playfair Display', serif", marginBottom: "20px", fontSize: "18px" }}>Convidado</h5>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", letterSpacing: "1px" }}>NOME OU FAMÍLIA</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.nome} 
                            onChange={e => setFormData({...formData, nome: e.target.value})}
                            style={{ borderRadius: "0", border: "none", borderBottom: "1px solid #eee", padding: "8px 0", fontSize: "14px", boxShadow: "none", background: "transparent" }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", letterSpacing: "1px" }}>QUANTIDADE</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={formData.quantidadePessoas} 
                            onChange={e => setFormData({...formData, quantidadePessoas: e.target.value})}
                            style={{ borderRadius: "0", border: "none", borderBottom: "1px solid #eee", padding: "8px 0", fontSize: "14px", boxShadow: "none", background: "transparent" }}
                        />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button variant="dark" className="w-100" style={{ borderRadius: "4px", fontSize: "11px", padding: "10px" }} onClick={handleSave}>SALVAR</Button>
                        <Button variant="light" className="w-100" style={{ borderRadius: "4px", fontSize: "11px", padding: "10px", border: "1px solid #eee" }} onClick={() => setShowModal(false)}>VOLTAR</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                .form-control:focus { border-bottom: 1px solid #c2a36b !important; }
            `}</style>
        </Container>
    );
};

export default Convidados;