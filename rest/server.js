require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT_REST || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
