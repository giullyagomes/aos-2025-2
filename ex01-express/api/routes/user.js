import { Router } from "express";
import { Sequelize } from "sequelize";

const userRouter = Router();

userRouter.get("/", async (request, response) => {
  try {
    const userList = await request.context.models.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: request.context.models.Message,
          attributes: ["id", "text", "createdAt"],
        },
      ],
    });
    return response.status(200).json(userList);
  } catch (error) {
    return response.status(500).json({ error: "Falha no sistema ao recuperar lista de usuários" });
  }
});

userRouter.get("/:userId", async (request, response) => {
  try {
    const foundUser = await request.context.models.User.findByPk(request.params.userId, {
      attributes: ["id", "username", "email"],
      include: [
        {
          model: request.context.models.Message,
          attributes: ["id", "text", "createdAt"],
        },
      ],
    });
    if (!foundUser) {
      return response.status(404).json({ error: "Usuário não localizado no banco de dados" });
    }
    return response.status(200).json(foundUser);
  } catch (error) {
    return response.status(500).json({ error: "Erro interno ao buscar dados do usuário" });
  }
});

userRouter.post("/", async (request, response) => {
  try {
    const { username, email } = request.body;
    if (!username || !email) {
      return response.status(400).json({ error: "Parâmetros obrigatórios não informados: username e email" });
    }
    const newUser = await request.context.models.User.create({ username, email });
    return response.status(201).json(newUser);
  } catch (error) {
    return response.status(500).json({ error: "Falha ao processar criação de novo usuário" });
  }
});

userRouter.put("/:userId", async (request, response) => {
  try {
    const { username, email } = request.body;
    const targetUser = await request.context.models.User.findByPk(request.params.userId);
    if (!targetUser) {
      return response.status(404).json({ error: "Registro de usuário não encontrado para atualização" });
    }
    await targetUser.update({ username, email });
    return response.status(200).json(targetUser);
  } catch (error) {
    return response.status(500).json({ error: "Erro no servidor ao atualizar informações do usuário" });
  }
});

userRouter.delete("/:userId", async (request, response) => {
  try {
    const targetUser = await request.context.models.User.findByPk(request.params.userId);
    if (!targetUser) {
      return response.status(404).json({ error: "Usuário não encontrado no sistema para exclusão" });
    }
    await targetUser.destroy();
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Falha no processo de exclusão do usuário" });
  }
});

export default userRouter;
