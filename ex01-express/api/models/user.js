import { DataTypes } from "sequelize";

const buildUserSchema = (dbInstance, { DataTypes }) => {
const UserEntity = dbInstance.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  UserEntity.associate = (dbModels) => {
    UserEntity.hasMany(dbModels.Message, { foreignKey: "userId" });
  };

  return UserEntity;
};

export default buildUserSchema;
