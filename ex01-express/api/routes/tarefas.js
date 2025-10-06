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
    const tarefasData = {
      id: uuidv4(),
      descricao: req.body.descrocao,
    };

    const tarefas = await req.context.models.Tarefas.create(tarefasData);

    return res.send(tarefas);
  } catch (error) {
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