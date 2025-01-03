import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainroutes from "./routes/index";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(mainroutes);

app.listen(process.env.Port || 4000, () => {
  console.log(`Rodando na porta: ${process.env.Port}`);
});
