import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";


const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

// Allow attaching `userId` to requests without TypeScript errors.
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}
const JWT_SECRET = "admin123";

// Authentication Middleware
function auth(req: any, res: any, next: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token ausente" });
    }
    const [, token] = authHeader.split(" ");
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ message: "Token inválido" });
    }
}
// register
app.post("/register", async (req, res) => {
    try {
        const schema = z.object({
            name: z.string().min(3),
            email: z.string().email(),
            password: z.string().min(6),
        });
        const data = schema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            return res.status(409).json({ message: "Este email já está em uso." });
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({ data: { ...data, password: hashed } });
        res.status(201).json(user); // return created user (without password)
    } catch (error) {
        res.status(400).json({ message: "Dados inválidos.", details: error }); // Bad Request
    }
});
// login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email ou senha inválido" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET,);
    res.json({ token });

});
// Get all messages for the authenticated user
app.get("/messages", auth, async (req, res) => {
    const messages = await prisma.message.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
});
// Post a new message and get an automated reply
app.post("/message", auth, async (req, res) => {
    const { content } = req.body;
    const userId = req.userId;

    if (typeof userId !== "number") { // should never happen due to auth middleware
        return res.status(400).json({ message: "Usuário não autenticado." });
    }
    const message = await prisma.message.create({
        data: { content, userId },
    });
    const aiResponses = [
        "Interessante! Conte mais.",
        "Não tenho certeza, mas parece legal!",
        "Hmm, e se tentássemos outra abordagem?",
        "Entendi parcialmente. Você pode explicar melhor?",
        `Recebi sua mensagem: "${content}". O que faremos a seguir?` 
    ];
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    const randomResponse = aiResponses[randomIndex];
    const reply = await prisma.message.create({
        data: {
            content: randomResponse, 
            fromIA: true,
            userId,
        },
    });
    res.status(201).json({ message, reply });
});
// Get current user info
app.get("/me", auth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true }, // exclude password
  });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }

  res.json(user);
});
// Update user info email and name
app.put("/user", auth, async (req, res) => {
  const schema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
  });

  try {
    const data = schema.parse(req.body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Nenhum dado para atualizar." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: data,
      select: { id: true, name: true, email: true },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Dados inválidos." });
  }
});
// Change user password
app.put("/user/password", auth, async (req, res) => {
  const schema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  });

  try {
    const { currentPassword, newPassword } = schema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Senha atual incorreta." });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    res.status(400).json({ message: "Dados inválidos." });
  }
});
app.listen(4000, () => console.log("Servidor rodando na porta 4000"));