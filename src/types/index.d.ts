import { JwtPayload as OriginalJwtPayload } from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload extends OriginalJwtPayload {
    email: string;
    role: string;
    id: string;
  }
}
