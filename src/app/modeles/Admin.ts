import { Role } from "./Role";
import { User } from "./User";

export class Admin extends User {
  constructor(id: number, firstname: string, lastname: string, username: string, password: string) {
    super(id, firstname, lastname, username, password, Role.ADMIN);
  }
}
