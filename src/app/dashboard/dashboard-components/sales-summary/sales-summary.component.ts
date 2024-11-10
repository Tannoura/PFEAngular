import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid
} from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { MembreService } from 'src/app/services/membre.service';
import { PresenceService } from 'src/app/services/presence.service';

export type salesChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html'
})
export class SalesSummaryComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<salesChartOptions>;
  constructor(private presenceService:PresenceService,private membreService:MembreService,private authService:AuthentificationService,private http :HttpClient) {
    this.salesChartOptions = {
      series: [
        {
          name: "Iphone 13",
          data: [0, 31, 40, 28, 51, 42, 109, 100],
        },
        {
          name: "Oneplue 9",
          data: [0, 11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        fontFamily: 'Nunito Sans,sans-serif',
        height: 250,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: '1',
      },
      grid: {
        strokeDashArray: 3,
      },

      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
        ],
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }



  ngOnInit(): void {
    this.authService.loadProfile();
    if(this.authService.isAdmin()){
      this.presencechartAdmin();
    }else if(this.authService.isSalarie()){
      this.presencechartSalarie();
    }

  }


  presencechartAdmin():void{
    this.http.get<Map<number, string>>('http://localhost:9000/api/sessions/matiere-mapping')
    .subscribe((sessionMatiereMapping: Map<number, string>) => {
      const sessionIds = Object.keys(sessionMatiereMapping).map(id => Number(id));
      const matiereLabels = Object.values(sessionMatiereMapping);
      this.http.get<{ [key: string]: number }>('http://localhost:9000/api/sessions/presence-rate', {
        params: { sessionIds: sessionIds.join(',') }
      }).subscribe((data: any) => {
        const values = sessionIds.map(id => data[id] || 0);
        this.salesChartOptions = {
          series: [
            {
              name: 'Taux de Présence',
              data: values
            }
          ],
          chart: {
            type: 'area',
            height: 450,
            toolbar: {
              show: true
            }
          },
          xaxis: {
            categories: matiereLabels,
            title: {
              text: 'Sessions'
            }
          },
          yaxis: {
            title: {
              text: 'Taux de Présence (%)'
            },
            min: 0
          },
          colors: ['#00E396'],
          grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 10
          },
          tooltip: {
            theme: 'dark'
          },
          stroke: {
            curve: 'smooth',
            width: '1',
          }
        };
      });
    });
  }


  presencechartSalarie(): void {
    const userId = this.authService.userId;
    this.membreService.getSessionsByUserId(userId).subscribe(sessions => {
      const sessionIds = sessions.map(session => session.id);
      const labels = sessions.map(session => session.module.matiere); // Assurez-vous que la propriété est correcte
      // Créer un tableau de Promesses pour chaque appel API
      const tauxPromises = sessionIds.map(sessionId =>
        this.presenceService.getTauxDePresenceParSessionAndUser(userId, sessionId).toPromise()
      );

      // Attendre que toutes les promesses soient résolues
      Promise.all(tauxPromises).then(tauxList => {
        this.salesChartOptions = {
          series: [
            {
              name: 'Taux de Présence',
              data: tauxList
            }
          ],
          chart: {
            type: 'bar',
            height: 450,
            toolbar: {
              show: true
            }
          },
          xaxis: {
            categories: labels,
            title: {
              text: 'Sessions'
            }
          },
          yaxis: {
            title: {
              text: 'Taux de Présence (%)'
            },
            min: 0
          },
          colors: ['#00E396'],
          grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 10
          },
          tooltip: {
            theme: 'dark'
          },
          stroke: {
            curve: 'smooth',
            width: '1',
          }
        };
      }).catch(error => {
        console.error('Erreur lors de la récupération des taux de présence:', error);
      });
    });
  }

  }



