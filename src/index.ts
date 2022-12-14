import express from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload';
import cors from 'cors'
import router from './routers';
import config from './config'

dotenv.config()
const app = express();

app.use(fileUpload({}));
app.use(express.static('public'));
app.use(express.json())
const port = config.port;

app.use('/',cors({
  origin: true,
  credentials: true
}), router);
app.listen(port, () => { 
  return console.log(`server is listening on ${port}`);
});

