import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt,faSearch  } from '@fortawesome/free-solid-svg-icons';

//HTTP
import { configprodutos } from '../Config/HTTP/ProdutosConstants';

// CSS
import '../Commom/CSS/Produtoscomponents.css';


function Main() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(configprodutos.url.API_URL + `/get-all-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.data && Array.isArray(result.data.products)) {
        setProducts(result.data.products);
      } else {
        console.error('API Response does not contain a products array:', result);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'price') {
      const formattedValue = parseFloat(value.replace(/[^0-9]/g, '') / 100).toFixed(2);
      setForm({ ...form, [name]: formattedValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validações
    if (!form.name || !form.price || !form.stock) {
      alert('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }
    if (isNaN(form.price) || form.price <= 0) {
      alert('O preço deve ser um número positivo.');
      return;
    }
    if (isNaN(form.stock) || form.stock < 0) {
      alert('A quantidade em estoque deve ser um número inteiro não negativo.');
      return;
    }
  
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10)
    };
  
    console.log('Dados do produto a serem criados:', productData); 
  
    setLoading(true);
    try {
      const response = await fetch(configprodutos.url.API_URL +  `/create-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Resposta da API ao criar produto:', result);
        fetchProducts();
        setForm({ name: '', description: '', price: '', stock: '' });
        setShowModal(false);
      } else {
        setErrors(result.message || { error: 'Falha ao criar produto' });
      }
    } catch (error) {
      console.error('Falha ao criar produto:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
  
    try {
      const response = await fetch(configprodutos.url.API_URL +  `/get-one-product/${searchId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const result = await response.json();
  
      if (response.ok && result.data) {
        setProducts([result.data.product]); 
      } else {
        setErrors(result.message || { error: 'Produto não encontrado' });
        setProducts([]); 
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name || !form.price || !form.stock) {
      alert('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }
    if (isNaN(form.price) || form.price <= 0) {
      alert('O preço deve ser um número positivo.');
      return;
    }
    if (isNaN(form.stock) || form.stock < 0) {
      alert('A quantidade em estoque deve ser um número inteiro não negativo.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(configprodutos.url.API_URL +  `/update-product/${selectedProductId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10)
        })
      });
      const result = await response.json();
      if (response.ok) {
        fetchProducts();
        setForm({ name: '', description: '', price: '', stock: '' });
        setEditMode(false);
        setSelectedProductId(null);
        setShowModal(false);
      } else {
        setErrors(result.message || { error: 'Falha ao atualizar produto' });
      }
    } catch (error) {
      console.error('Falha ao atualizar produto:', error);
      fetchProducts();
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza de que deseja deletar este produto?')) {
        setLoading(true);
        try {
            const response = await fetch(configprodutos.url.API_URL + `/delete-product/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
           
            if (response.ok) {
                
                const result = await response.json().catch(() => null);
                console.log('Produto deletado com sucesso:', result);

                
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
                fetchProducts(); 
            } else {
               
                console.error(`HTTP error! status: ${response.status}`);
                fetchProducts();
            }
        } catch (error) {
            console.error('Erro em deletar o produto:', error);
        } finally {
            setLoading(false);
        }
    }
};

  

const handleEdit = (product) => {
  setForm(product);
  setSelectedProductId(product.id);
  setEditMode(true);
  setShowModal(true);
};

  const openCreateModal = () => {
    setForm({ name: '', description: '', price: '', stock: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const resetSearch = () => {
    setSearchId('');
    fetchProducts();
  };


  return (
    <div className="container">

      <div className='row-produtos-div1'>
      <h1 className='text-row-produtos-div1'>Produtos ({products.length})</h1>

      <button className='button-row-produtos-div1' onClick={openCreateModal}>Criar Produto</button>
      </div>

      <div className="search-bar">
    <input
      type="number"
      placeholder="Buscar produto por ID"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
      className='input-pesquisar'
    />
        <button className='button-pesquisar' onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>

    <button className='button-mostrartodos' onClick={resetSearch}>Mostrar Todos</button>
  </div>

      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form className='forms-div' onSubmit={editMode ? handleUpdate : handleCreate}>
            <div className='alinhar-inputs'>
              <label className='label-main'>Nome:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className='input-main'
              />
            </div>
            <div  className='alinhar-inputs'>
              <label className='label-main'>Descrição:</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                 className='input-main'
              />
            </div>
            <div className='alinhar-inputs'>
              <label className='label-main'>Preço:</label>
              <input
                type="text"
                name="price"
                value={form.price ? `R$ ${form.price}` : ''}
                onChange={handleChange}
                required
                className='input-main'
              />

            </div>
            <div  className='alinhar-inputs'>
              <label className='label-main'>Estoque:</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                 className='input-main'
              />
            </div>
            <button className='button-criar' type="submit">
              {editMode ? 'Atualizar Produto' : 'Criar Produto'}
            </button>
          </form>
        </div>
      </div>

      <div className='divprincipal-produtos-cards'>
      {loading && <Oval color="blue" height={30} width={30} />}
        {products.map((product) => (
          <div className='div-card-produtos' key={product.id}>
            <div className='div1-info'>
            <h1 className='text-infoproduto'>Id do produto: <h1 className='subtext-infoproduto'>{product.id}</h1></h1>
            <h1 className='text-infoproduto'>Nome do produto: <h1 className='subtext-infoproduto'>{product.name}</h1></h1>
            <h1 className='text-infoproduto'>Descrição do produto: <h1 className='subtext-infoproduto'>{product.description}</h1></h1>
            <h1 className='text-infoproduto'>Preço do produto: <h1 className='subtext-infoproduto'>R$ {product.price}</h1></h1>
            <h1 className='text-infoproduto'>Estoque: <h1 className='subtext-infoproduto'>{product.stock} Qtd</h1></h1>
            </div>

            <div className='div2-info'>
            <button onClick={() => handleEdit(product)} className='icon-button1'>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className='icon-button2'>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
