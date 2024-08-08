import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import HTTP
import { config } from '../Config/HTTP/Constants';

// CSS
import '../Commom/CSS/Register.css';

function Register() {
  const [name, setName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleTaxNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    setTaxNumber(numericValue);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
    setPhone(numericValue);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase(); // Converte para minúsculas
    const emailFormatted = value.replace(/\s/g, ''); // Remove espaços
    setMail(emailFormatted);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      console.log({
        name,
        taxNumber,
        mail,
        phone,
        password,
      });
  
      const response = await fetch(config.url.API_URL + `/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          taxNumber,
          mail,
          phone,
          password,
        })
      });
  
      if (!response.ok) {
        throw new Error('Falha ao registar usuario');
      }
  
      const data = await response.json();
      alert('Usuário registrado com sucesso!');
      
      setName('');
      setTaxNumber('');
      setMail('');
      setPhone('');
      setPassword('');
      
      navigate('/');
      
    } catch (err) {
      alert('Falha ao registrar. Por favor, verifique seus dados.');
      console.error(err);
    }
  };
  

  const Login = () => {
    window.location.href = '/';
  };

  return (
    <div className='body-register'>
      <div className='div2-register'>
        <h2 className='titulo-register'>Registrar</h2>
        <form className='forms-div' onSubmit={handleRegister}>
       
          <div className='alinhar-inputs'>
            <label className='label-register'>Nome:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className='input-register'
            />
          </div>
          <div className='alinhar-inputs'>
            <label className='label-register'>CPF ou CNPJ (Sem pontuação):</label>
            <input 
              type="text" 
              value={taxNumber} 
              onChange={handleTaxNumberChange} 
              required 
              className='input-register'
            />
          </div>
          <div className='alinhar-inputs'>
            <label className='label-register'>E-mail:</label>
            <input 
              type="email" 
              value={mail} 
              onChange={handleEmailChange} 
              required 
              className='input-register'
            />
          </div>
          <div className='alinhar-inputs'>
            <label className='label-register'>Telefone:</label>
            <input 
              type="text" 
              value={phone} 
              onChange={handlePhoneChange} 
              required 
              className='input-register'
            />
          </div>
          <div className='alinhar-inputs'>
            <label className='label-register'>Senha:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className='input-register'
            />
          </div>
          <button className='button-registrar' type="submit">Registrar</button>
        </form>
        <h1 className='text-temconta'>
          Já tem uma conta? <span onClick={Login} className='text-cliqueaqui'>Clique aqui.</span>
        </h1>
      </div>
    </div>
  );
}

export default Register;
