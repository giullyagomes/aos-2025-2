import { v4 as uuidv4 } from "uuid";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Tarefas.findAll();
    return res.send(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:tarefasId", async (req, res) => {
  try {
    const message = await req.context.models.Tarefas.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.send(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.context.me:", req.context.me);
    if (!req.context.me) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    if (!req.body.text) {
      return res.status(400).json({ error: "Texto da mensagem é obrigatório" });
    }

    // Use o ID do usuário autenticado ao invés do userId do body
    const userId = req.context.me.id;
    console.log("userId type:", typeof userId, "value:", userId);
    
    const tarefasData = {
      id: uuidv4(),
      descricao: req.body.descrocao,
      userId: userId,
    };
    console.log("tarefasData:", messageData);

    const tarefas = await req.context.models.Tarefas.create(tarefasData);

    return res.send(tarefas);
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: error.tarefas });
  }
});

router.delete("/:tarefasId", async (req, res) => {
  try {
    const tarefas = await req.context.models.Tarefas.findByPk(req.params.tarefasId);
    if (!tarefas) {
      return res.status(404).json({ error: "tarefa não encontrada" });
    }

    await tarefas.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;