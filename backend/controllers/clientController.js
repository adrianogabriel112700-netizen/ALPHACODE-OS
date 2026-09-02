exports.getClients = async (req, res) => {
  return res.json([
    { id: '1', name: 'Empresa X', email: 'contato@empresax.com', status: 'active' }
  ]);
};