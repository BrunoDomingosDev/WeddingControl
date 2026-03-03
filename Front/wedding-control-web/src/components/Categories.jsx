import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Pencil, Trash2, Plus } from 'lucide-react';
import api from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: 0, nome: '', fechado: false });

    useEffect(() => { loadCategories(); }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categoria');
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch { console.error('Erro'); }
        finally { setLoading(false); }
    };

    const handleShow = (categoria = { id: 0, nome: '', fechado: false }) => {
        setFormData(categoria);
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.nome.trim()) return;
        try {
            if (formData.id === 0) await api.post('/categoria', formData);
            else await api.put(`/categoria/${formData.id}`, formData);
            setShowModal(false);
            loadCategories();
        } catch { alert('Erro ao salvar'); }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><Spinner animation="border" variant="secondary" size="sm" /></div>;

    return (
        <Container fluid className="px-3 px-md-5" style={{ maxWidth: "900px", marginTop: "40px", marginBottom: "60px" }}>
            

            {/* HEADER RESPONSIVO - BOTÃO SEMPRE EMBAIXO DO TITULO */}
            <div className="mb-5">
                <div className="mb-3">
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "calc(1.8rem + 1vw)", color: "#1a1a1a", marginBottom: "4px" }}>
                        Categorias
                    </h1>
                    <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#c2a36b", fontWeight: "600", textTransform: "uppercase", margin: 0 }}>
                        Planejamento de serviços
                    </p>
                </div>
                <Button 
                    onClick={() => handleShow()} 
                    className="w-100 w-md-auto"
                    style={{ backgroundColor: "#1a1a1a", border: "none", borderRadius: "4px", padding: "10px 24px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px" }}
                >
                    ADICIONAR
                </Button>
            </div>

            {/* LISTA REFINADA */}
            <div style={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
                <Table borderless className="mb-0">
                    <thead>
                        <tr style={{ borderBottom: "1px solid #f8f8f8" }}>
                            <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }}>DESCRIÇÃO</th>
                            <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-center d-none d-sm-table-cell">STATUS</th>
                            <th style={{ padding: "16px 20px", fontSize: "9px", color: "#aaa", letterSpacing: "1px" }} className="text-end">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-5 text-muted small">Nenhuma categoria encontrada</td></tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat.id} style={{ borderBottom: "1px solid #f8f8f8" }} className="align-middle">
                                    <td style={{ padding: "16px 20px" }}>
                                        <div style={{ fontSize: "14px", color: cat.fechado ? "#bbb" : "#444", fontWeight: "500" }}>
                                            {cat.nome}
                                        </div>
                                        {/* Status visível apenas no mobile abaixo do nome */}
                                        <div className="d-sm-none mt-1">
                                            <span style={{ fontSize: "8px", fontWeight: "700", color: cat.fechado ? "#bbb" : "#c2a36b" }}>
                                                {cat.fechado ? "CONCLUÍDO" : "EM ABERTO"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center d-none d-sm-table-cell" style={{ padding: "16px 20px" }}>
                                        <span style={{ 
                                            fontSize: "9px", 
                                            fontWeight: "700", 
                                            padding: "4px 10px", 
                                            borderRadius: "2px",
                                            letterSpacing: "0.5px",
                                            backgroundColor: cat.fechado ? "#f5f5f5" : "#fff9f0",
                                            color: cat.fechado ? "#999" : "#c2a36b",
                                            border: cat.fechado ? "1px solid #eee" : "1px solid #fbeed5"
                                        }}>
                                            {cat.fechado ? "CONCLUÍDO" : "EM ABERTO"}
                                        </span>
                                    </td>
                                    <td className="text-end" style={{ padding: "16px 20px" }}>
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button variant="link" className="text-dark p-1" onClick={() => handleShow(cat)}>
                                                <Pencil size={15} strokeWidth={1.5} />
                                            </Button>
                                            <Button variant="link" className="text-muted p-1" onClick={() => { if (window.confirm('Excluir?')) api.delete(`/categoria/${cat.id}`).then(loadCategories) }}>
                                                <Trash2 size={15} strokeWidth={1.5} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>

            {/* MODAL ADAPTADO */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
                <Modal.Body className="p-4">
                    <h5 style={{ fontFamily: "'Playfair Display', serif", marginBottom: "20px", fontSize: "18px" }}>Categoria</h5>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", letterSpacing: "1px" }}>NOME</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={formData.nome} 
                            onChange={e => setFormData({...formData, nome: e.target.value})}
                            style={{ borderRadius: "0", border: "none", borderBottom: "1px solid #eee", padding: "8px 0", fontSize: "14px", boxShadow: "none", backgroundColor: "transparent" }}
                        />
                    </Form.Group>
                    <Form.Check 
                        type="switch"
                        id="cat-status"
                        label={<span style={{ fontSize: "12px", color: "#666" }}>Finalizada</span>}
                        checked={formData.fechado}
                        onChange={e => setFormData({...formData, fechado: e.target.checked})}
                        className="mb-4"
                    />
                    <div className="d-flex flex-column gap-2">
                        <Button variant="dark" style={{ borderRadius: "4px", fontSize: "12px", padding: "10px" }} onClick={handleSave}>SALVAR</Button>
                        <Button variant="light" style={{ borderRadius: "4px", fontSize: "12px", padding: "10px", border: "1px solid #eee" }} onClick={() => setShowModal(false)}>VOLTAR</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style>{`
                .form-control:focus { border-bottom: 1px solid #c2a36b !important; }
            `}</style>
        </Container>
    );
};

export default Categories;