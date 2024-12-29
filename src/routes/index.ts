import { Router } from "express";
import * as control from "../control/control";
const router = Router();

router.get("/listar", control.Cadastro);

export default router;
