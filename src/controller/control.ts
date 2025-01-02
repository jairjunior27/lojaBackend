import { Request, Response } from "express";
import { usuarioType } from "../types/usuario";
import { prisma } from "../libs/prisma";
import bcrypt from "bcrypt";

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
