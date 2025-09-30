import { DataTypes } from "sequelize";

const createMessageSchema = (dbConnection, { DataTypes }) => {
const MessageEntity = dbConnection.define("message", {
    id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  MessageEntity.associate = (dbModels) => {
    MessageEntity.belongsTo(dbModels.User, { foreignKey: "userId" });
  };

  return MessageEntity;
};

export default createMessageSchema;
