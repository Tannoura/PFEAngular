import { Component, OnInit } from '@angular/core';
import {Product,TopSelling} from './top-selling-data';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-top-selling',
  templateUrl: './top-selling.component.html'
})
export class TopSellingComponent implements OnInit {

  topSelling:Product[];
  salaries: any[] = [];
  authser: any;
  constructor(private authService:AuthentificationService) {

    this.topSelling=TopSelling;
  }

  ngOnInit(): void {
    this.authService.loadProfile();
    this.getAllSalariés();
    this.authser = this.authService;
  }

  getAllSalariés(): void {
    this.authService.getAllSalariés().subscribe(data => {
      this.salaries = data;
      this.updateTopSelling();
    });
  }
  updateTopSelling(): void {
    this.topSelling = this.salaries.map(salarié => ({
      image: 'assets/images/users/user2.jpg',  // Utilise une image par défaut ou une logique pour choisir l'image
      uname: salarié.username,  // Adapte en fonction des données disponibles
      gmail: '',  // Adapte en fonction des données disponibles
      productName: salarié.poste ? salarié.poste.specialite : 'N/A',
      status: this.mapStatus(salarié),  // Transforme les données en un format de statut approprié
      budget: salarié.lastname , // Adapte selon les besoins
      weeks: salarié.firstname,  // Adapte selon les besoins

    }));
  }
  mapStatus(salarié: any): string {
    return salarié.emailConfirmed ? 'success' : 'danger';
  }
}
