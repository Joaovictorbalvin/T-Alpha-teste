const prod = {
    url: {
      API_URL: 'https://interview.t-alpha.com.br/api/products'
    }
  };
      const dev = { 
      url: { 
        API_URL: 'https://interview.t-alpha.com.br/api/products'
      } 
  };
  
  export const configprodutos = process.env.NODE_ENV === 'development' ? dev : prod;