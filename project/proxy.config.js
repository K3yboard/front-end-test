const proxy = [
  {
      context: '/api',
      target: 'https://5cfa67ebf26e8c00146d0756.mockapi.io',
      pathRewrite: {'^/api' : ''},
      secure: false,
      changeOrigin: true
  }
];

module.exports = proxy;
