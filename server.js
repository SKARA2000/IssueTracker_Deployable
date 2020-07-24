const express = require('express');
require('dotenv').config();

const { connectToDB } = require('./db.js');
const { installHandler } = require('./api_handler.js');

const port = process.env.PORT || 5000;

const app = express();
installHandler(app);

(async function () {
  try {
    await connectToDB();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
}());
