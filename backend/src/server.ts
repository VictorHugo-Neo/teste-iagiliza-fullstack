import fastify, { FastifyRequest, FastifyReply } from "fastify"; // Import Fastify and types
import cors from "@fastify/cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import 'dotenv/config';


const app = fastify({ logger: true }); // Initialize Fastify
const prisma = new PrismaClient();

app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});


const secretFromEnv = process.env.JWT_SECRET;
if (!secretFromEnv) { // Check if JWT_SECRET is defined
  console.error("ERRO FATAL: A variável de ambiente JWT_SECRET não está definida.");
  process.exit(1);
}
const JWT_SECRET: string = secretFromEnv; // Now TypeScript knows this is a string

interface TokenPayload {
  id: number;
}

app.decorate('userId', null);
declare module 'fastify' {
  interface FastifyRequest {
    userId: number | null;
  }
}


const auth = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.code(401).send({ message: "Token ausente" });
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && 'id' in decoded) {
      request.userId = (decoded as TokenPayload).id;
    } else {
      throw new Error("Formato de token inválido");
    }
  } catch (err) {
    return reply.code(401).send({ message: "Token inválido" });
  }
}

// register
app.post("/register", async (request, reply) => {
  try {
    const schema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const data = schema.parse(request.body);
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {

      return reply.code(409).send({ message: "Este email já está em uso." });
    }
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({ data: { ...data, password: hashed } });

    reply.code(201).send(user); // return created user (without password)
  } catch (error) {

    reply.code(400).send({ message: "Dados inválidos.", details: error }); // Bad Request
  }
});


// login
app.post("/login", async (request, reply) => {

  const { email, password } = request.body as any;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {

    return reply.code(401).send({ message: "Email ou senha inválido" });
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET,);

  reply.send({ token });
});


// Get all messages for the authenticated user
app.get("/messages", { preHandler: [auth] }, async (request, reply) => {
  const messages = await prisma.message.findMany({

    where: { userId: request.userId! },
    orderBy: { createdAt: 'asc' },
  });

  reply.send(messages);
});


// Post a new message and get an automated reply
app.post("/message", { preHandler: [auth] }, async (request, reply) => {

  const { content } = request.body as any;

  const userId = request.userId!;

  if (typeof userId !== "number") { // should never happen due to auth middleware
    return reply.code(400).send({ message: "Usuário não autenticado." });
  }
  const message = await prisma.message.create({
    data: { content, userId },
  });
  const aiResponses = [ // Simulated AI responses
    "Obrigado por sua mensagem!",
    "Interessante! Conte mais.",
    "Não tenho certeza, mas parece legal!",
    "Hmm, e se tentássemos outra abordagem?",
    "Entendi parcialmente. Você pode explicar melhor?",
    `Recebi sua mensagem: "${content}". O que faremos a seguir?`
  ];
  const randomIndex = Math.floor(Math.random() * aiResponses.length);
  const randomResponse = aiResponses[randomIndex];
  const aiReply = await prisma.message.create({
    data: {
      content: randomResponse,
      fromIA: true,
      userId,
    },
  });

  reply.code(201).send({ message, reply: aiReply });
});


// Get current user info
app.get("/me", { preHandler: [auth] }, async (request, reply) => {
  const user = await prisma.user.findUnique({
    
    where: { id: request.userId! },
    select: { id: true, name: true, email: true }, // exclude password
  });

  if (!user) {
    return reply.code(404).send({ message: "Usuário não encontrado." });
  }
  reply.send(user);
});


// Update user info email and name
app.put("/user", { preHandler: [auth] }, async (request, reply) => {
  const schema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
  });

  try {
    const data = schema.parse(request.body);
    if (Object.keys(data).length === 0) {
      return reply.code(400).send({ message: "Nenhum dado para atualizar." });
    }
    const updatedUser = await prisma.user.update({
      where: { id: request.userId! },
      data: data,
      select: { id: true, name: true, email: true },
    });
    reply.send(updatedUser);
  } catch (error) {
    // Enhanced error handling
    console.error("ERRO AO ATUALIZAR USUÁRIO:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return reply.code(400).send({
        message: "Dados de entrada inválidos.",
        errors: error.flatten().fieldErrors,
      });
    }

    // Handle unique constraint violation (e.g., email already in use)
    return reply.code(500).send({
      message: "Ocorreu um erro interno ao tentar atualizar o usuário.",
    });
  }
});

// Change user password
app.put("/user/password", { preHandler: [auth] }, async (request, reply) => {
  const schema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
  });

  try {
    const { currentPassword, newPassword } = schema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { id: request.userId! } });
    if (!user) {
      return reply.code(404).send({ message: "Usuário não encontrado." });
    }
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return reply.code(401).send({ message: "Senha atual incorreta." });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: request.userId! },
      data: { password: hashedNewPassword },
    });
    reply.code(200).send({ message: "Senha alterada com sucesso." });
  } catch (error) {
    reply.code(400).send({ message: "Dados inválidos." });
  }
});

const start = async () => {
  try {
    await app.listen({ port: 4000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();