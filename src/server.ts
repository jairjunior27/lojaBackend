import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainroutes from "./routes/index";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(mainroutes);

app.listen(process.env.Port || 4000, () => {
  console.log(`Rodando na porta: ${process.env.Port}`);
});
