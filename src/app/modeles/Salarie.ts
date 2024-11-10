import { Poste } from "./Poste";
import { Role } from "./Role";
import { User } from "./User";

export class Salarie extends User {
  poste: Poste;

  constructor(id: number, firstname: string, lastname: string, username: string, password: string, poste: Poste) {
    super(id, firstname, lastname, username, password, Role.SALARIE);
    this.poste = poste;
  }
}
