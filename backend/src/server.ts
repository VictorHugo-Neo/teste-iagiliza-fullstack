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

const JWT_SECRET = "admin123";

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

app.listen(4000, () => console.log("Servidor rodando na porta 4000"));