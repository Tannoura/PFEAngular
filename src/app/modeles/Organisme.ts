import { Module } from "./Module";
import { Image } from "./Image";
export class Organisme {
  id!: number;
  nomOrganisme!: string;
  adresseOrganisme!: string;
  numeroOrganisme!: number | null;
  modules!: Module[];
  image!: Image;
}
