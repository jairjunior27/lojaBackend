import { Router } from "express";
import * as controler from "../controller/control";
import { uploadImg } from "../midleware/upload";

const route = Router();

route.post("/cadastro", uploadImg.single("imagem"), controler.Cadastro);
route.post("/login", controler.login);
route.post("/validatoken", controler.validaToken);
export default route;
