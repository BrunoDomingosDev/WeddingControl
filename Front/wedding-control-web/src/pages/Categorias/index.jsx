import 'bootstrap/dist/css/bootstrap.min.css';
import Categories from '../../components/Categories'; // O pulo do gato está aqui: volte duas pastas

const CategoriasPage = () => {
    return (
        <div>
            {/* Aqui renderizamos o componente que criamos acima */}
            <Categories />
        </div>
    );
};

export default CategoriasPage;