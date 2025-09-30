import session from "./session";
import userRouter from "./user";
import messageRouter from "./message";
import root from "./root";

export default {
  root,
  session,
  user: userRouter,
  message: messageRouter,
};
