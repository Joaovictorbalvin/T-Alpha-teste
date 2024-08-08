import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Pages
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Main from '../Pages/Main';
import Rotasprivadas from '../Config/PrivateRotas/Rotasprivadas';

const Rotas = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<Rotasprivadas />}>
          <Route path='/main' element={<Main />} />
        </Route>
        
      </Routes>
    </Router>
  );
};

export default Rotas;
