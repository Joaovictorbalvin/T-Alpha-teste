const prod = {
  url: {
    API_URL: 'https://interview.t-alpha.com.br'
  }
};
    const dev = { 
    url: { 
      API_URL: 'https://interview.t-alpha.com.br'
    } 
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;