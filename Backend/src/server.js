const app = require('./app');
const PORT = process.env.PORT || 5000; // Usa porta do ambiente ou 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
