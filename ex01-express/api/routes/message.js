import { v4 as generateUniqueId } from "uuid";
import { Router } from "express";

const messageRouter = Router();

messageRouter.get("/", async (request, response) => {
  try {
    const messageList = await request.context.models.Message.findAll();
    return response.send(messageList);
  } catch (error) {
    return response.status(500).json({ error: "Erro no servidor ao carregar mensagens" });
  }
});

messageRouter.get("/:messageId", async (request, response) => {
  try {
    const foundMessage = await request.context.models.Message.findByPk(request.params.messageId);
    if (!foundMessage) {
      return response.status(404).json({ error: "Mensagem não encontrada no banco de dados" });
    }
    return response.send(foundMessage);
  } catch (error) {
    return response.status(500).json({ error: "Falha interna ao buscar mensagem" });
  }
});

messageRouter.post("/", async (request, response) => {
  try {
    console.log("request.body:", request.body);
    console.log("request.context.me:", request.context.me);
    if (!request.context.me) {
      return response.status(401).json({ error: "Acesso não autorizado: autenticação requerida" });
    }
    if (!request.body.text) {
      return response.status(400).json({ error: "Campo texto da mensagem é obrigatório" });
    }

    const userId = request.context.me.id;
    console.log("userId type:", typeof userId, "value:", userId);
    
    const newMessageData = {
      id: generateUniqueId(),
      text: request.body.text,
      userId: userId,
    };
    console.log("newMessageData:", newMessageData);

    const createdMessage = await request.context.models.Message.create(newMessageData);

    return response.send(createdMessage);
  } catch (error) {
    console.error("Erro:", error);
    return response.status(500).json({ error: "Erro interno ao processar criação da mensagem" });
  }
});

messageRouter.delete("/:messageId", async (request, response) => {
  try {
    const targetMessage = await request.context.models.Message.findByPk(request.params.messageId);
    if (!targetMessage) {
      return response.status(404).json({ error: "Mensagem não encontrada para exclusão" });
    }

    await targetMessage.destroy();
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Falha no sistema ao excluir mensagem" });
  }
});

export default messageRouter;
