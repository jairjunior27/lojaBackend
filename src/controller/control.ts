import { Request, Response } from "express";
import { usuarioType } from "../types/usuario";
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Cadastro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, password, email, telefone }: usuarioType = req.body;
    const imagem = req.file?.filename;

    if (!nome || !email || !telefone || !password || !imagem) {
      res.json({ msg: "Favor preencher todos os campos" });
      return;
    }

    if (!imagem) {
      res
        .status(400)
        .json({ msg: "Arquivo Inválido, formato aceito JPG, JPEG, PNG" });
      return;
    }

    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (emailExistente) {
      res.json({ msg: "Email já existe favor inserir um cpf valido" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passHash = await bcrypt.hash(password, salt);

    await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        password: passHash,
        imagem,
      },
    });

    res.status(201).json({ msg: "Usúario cadastrado com sucesso" });
    return;
  } catch (err) {
    console.error("Erro no servidor:", err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const email = req.body.email as string;
  const password = req.body.password as string;
  try {
    console.log("verifique ", req.body);
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ msg: "Credenciais inválidas" });
      return;
    }

    const verificaPassword = await bcrypt.compare(password, user.password);
    if (!verificaPassword) {
      res.status(401).json({ msg: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.secret as string, {
      expiresIn: "1h",
    });

    res.status(200).json({
      msg: "Login realizado com sucesso",
      userId: user.id,
      token,
      status: true,
    });
  } catch (err) {
    console.error("Erro no servidor:", err);
    res
      .status(500)
      .json({ msg: "Aconteceu um erro no servidor, tente mais tarde" });
    return;
  }
};

export const validaToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ msg: "Token não fornecido" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ msg: "Token inválido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.secret as string);
    res.json({ user: decoded });
    return;
  } catch (err) {
    res.status(401).json({ msg: "Token invalido ou expirado" });
    return;
  }
};
