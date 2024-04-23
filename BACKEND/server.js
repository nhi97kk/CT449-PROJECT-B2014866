const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });

const app = require('./app');

async function startServer() {
  try {
    const { PORT, MONGODB_URI, NODE_ENV } = process.env;

    console.log(`Environment: ${NODE_ENV}`);

    // Connect to mongodb
    await mongoose.connect(MONGODB_URI);
    console.log(`Connect to ${MONGODB_URI} successfully!`);

    // App listen
    app.listen(PORT);

    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.log('There is some internal error!');
    process.exit(1);
  }
}

startServer();

