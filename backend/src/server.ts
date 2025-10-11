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
        const decoded = jwt.verify(token, JWT_SECRET) as {id: number};
        req.userId = decoded.id;
        next();
    }catch {
        return res.status(401).json({ message: "Token inválido" });
    }
}
// register
app.post("/register", async (req, res) => {
    const schema = z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
    });
    const data = schema.parse(req.body);
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({data: { ...data, password: hashed } });
    res.json(user);
});
// login
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email ou senha inválido" });
    }
    const token = jwt.sign({id: user.id}, JWT_SECRET,);
    res.json({ token });

});
// Creates a user message and generates an immediate AI reply.
app.post("/message", auth, async (req, res) => {
    const { content } = req.body;
    if (typeof req.userId !== "number") {
        return res.status(400).json({ message: "Usuário não autenticado." });
    }
    const message = await prisma.message.create({
        data: { content, userId: req.userId },
    });
    const reply = await prisma.message.create({
        data: {
            content: "Olá, sou a Eliza! Você falou: " + content,
            fromIA: true,
            userId: req.userId,
        },
    });
    res.json({ message, reply });

});

app.listen(4000, () => console.log("Servidor rodando na porta 4000"));