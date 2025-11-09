import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';


const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
app.post('/Usuarios', async (req, res) => {
  try {
    const created = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/Usuarios', async (req, res) => {
  try {
    const name = req.query.name;
    const users = name
      ? await prisma.user.findMany({
          where: {
            name: { contains: String(name) }
          }
        })
      : await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/Usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/Usuarios/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.user.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Usuario Deletado com Sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Servidor a correr em http://localhost:${PORT}`));

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});


