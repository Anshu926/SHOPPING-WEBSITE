const { startServer } = require("./server");

module.exports = async (req, res) => {
  const app = await startServer();
  return app(req, res);
};