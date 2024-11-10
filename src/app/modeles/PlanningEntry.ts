import { Session } from "./Session";
import { Time, WeekDay } from "@angular/common";


export class PlanningEntry {
  id: number;
  debut: Time;
  fin: Time;
  jour: WeekDay;
  session: Session;

  constructor(id: number, debut: Time, fin: Time, jour: WeekDay, session: Session) {
    this.id = id;
    this.debut = debut;
    this.fin = fin;
    this.jour = jour;
    this.session = session;
  }
}
