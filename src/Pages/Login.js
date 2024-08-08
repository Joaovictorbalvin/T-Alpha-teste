import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

// Import HTTP
import { config } from '../Config/HTTP/Constants';

// Import CSS
import '../Commom/CSS/Login.css';

function Login() {
  const [taxNumber, setTaxNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // useNavigate hook to handle navigation

  const handleTaxNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    setTaxNumber(numericValue);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!taxNumber || !password) {
      alert('Todos os campos são obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(config.url.API_URL + `/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taxNumber,
          password,
        })
      });
      const data = await response.json();
      setLoading(false);
      console.log('API resposta:', data);
      if (!response.ok) {
        throw new Error('Falha ao entrar');
      }
      const token = data.data.token;
      localStorage.setItem('token', token); 
      alert('Login realizado com sucesso!');
      console.log('Login realizado com sucesso:', token);
      navigate('/main');
    } catch (err) {
      setLoading(false);
      alert('Falha ao fazer login. Por favor, verifique suas credenciais.');
    }
  };

  const Registrar = () => {
    window.location.href = '/register';
  };

  return (
    <div className='body-login'>
      <div className='div1-login' />

      <div className='div2-login'>
        <h2 className='titulo-login'>Login</h2>
        <form className='forms-div' onSubmit={handleLogin}>
          <div className='alinhar-inputs'>
            <label className='label-login'>CPF ou CNPJ:</label>
            <input 
              type="text" 
              value={taxNumber} 
              onChange={handleTaxNumberChange} 
              required 
              className='input-login'
            />
          </div>
          <div className='alinhar-inputs'>
            <label className='label-login'>Senha:</label>
            <div className='password-input-container'>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className='input-login'
              />
            
            </div>
          </div>
          <button className='button-entrar' type="submit" disabled={loading}>
            {loading ? (
              <Oval
                height={20}
                width={20}
                color="rgb(68, 68, 187)"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#ffffff"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        <h1 className='text-aindanaoconta'>
          Ainda não tem uma conta? <span onClick={Registrar} className='text-experimentar'>Experimentar</span>
        </h1>
      </div>
    </div>
  );
}

export default Login;
