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
  try {
    const { email, password }: usuarioType = req.body;
    if (!email || !password) {
      res.status(400).json({ msg: "Email e senha são obrigatórios" });
      return;
    }
    console.log("Email:", email); // Verifique se o email está correto
    console.log("Password:", password); // Verifique se a senha está correta

    const user = await prisma.usuario.findUnique({
      where: { email },
    });
    console.log("User:", user);
    if (!user) {
      res.json({ msg: "Credenciais inválidas" });
      return;
    }

    const passwordVerificado = await bcrypt.compare(password, user.password);
    if (!passwordVerificado) {
      res.json({ mmsg: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.secret as string, {
      expiresIn: "1h",
    });

    res.status(200).json({
      msg: "Login Realizado com Sucesso",
      status: true,
      userId: user.id,
      token,
    });
    console.log(token);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro no servidor, favor tentar mais tarde" });
    return;
  }
};
