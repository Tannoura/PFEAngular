import { Module } from "./Module";
import { Organisme } from "./Organisme";
import { PlanningType } from "./PlanningType";
import { StatutSession } from "./StatutSession";

export class Session {
  id: number;
  salle: string;
  capacite: number;
  datedebut: string;
  datefin: string;
  cout:number;
  planningType: PlanningType;
  statutSession:StatutSession;
  module: Module; // Assuming you have a Module model
  organisme: Organisme; // Assuming you have an Organisme model


  constructor(id: number, salle: string, capacite: number, planningType: PlanningType, datedebut: string,
    datefin: string,statutSession: StatutSession,cout:number, module: Module,
    organisme: Organisme) {
    this.id = id;
    this.salle = salle;
    this.capacite = capacite;
    this.planningType = planningType;
    this.statutSession = statutSession;
    this.datedebut = datedebut;
    this.datefin = datefin;
    this.cout = cout;
    this.module = module;
    this.organisme = organisme;
  }
}
