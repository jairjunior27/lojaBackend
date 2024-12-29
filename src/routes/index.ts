import { Router } from "express";
import * as control from "../control/control";
const router = Router();

router.post("/cadastro", control.Cadastro);

export default router;
