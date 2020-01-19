import { buildSchema } from "type-graphql";
import { AuthorBookResolver } from "../modules/author-book/AuthorBookResolver";
import { ChangePasswordResolver } from "../modules/user/ChangePassword";
import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
import {
  CreateProductResolver
} from "../modules/user/CreateResolver";
import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
import { LoginResolver } from "../modules/user/Login";
import { LogoutResolver } from "../modules/user/Logout";
import { RegisterResolver } from "../modules/user/Register";
import { UserResolver } from "../modules/user/UserResolver";
import { isAuth } from "../modules/middleware/isAuth";

export const createSchema = () =>
  buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      UserResolver,
      RegisterResolver,
      CreateProductResolver,
      AuthorBookResolver,
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
   // globalMiddlewares: [isAuth]
  });
