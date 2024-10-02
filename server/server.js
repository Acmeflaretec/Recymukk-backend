const app = require("./app.js");
const { connect, connection } = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

async function server() {     
  try {
    const mongoUrl = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL_PROD : process.env.MONGO_URL_LOCAL;

    app.listen(process.env.PORT_LOCAL, () => console.log(`Listening on port ${process.env.PORT_LOCAL}`));
    connect(`${mongoUrl}/${process.env.DATABASE_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
    connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });
  } catch (error) {
    console.log(error.message);
  }
}

server();