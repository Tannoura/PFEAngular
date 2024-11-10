import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [


  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: [],
    roles:['ADMIN','SALARIE']
  },
  {
    path: '/component/alert',
    title: 'Alert',
    icon: 'bi bi-bell',
    class: '',
    extralink: false,
    submenu: [],
    roles:[]

  },
  /*
  ,
  {
    path: '/component/badges',
    title: 'Session pour ton poste',
    icon: 'bi bi-patch-check',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/component/buttons',
    title: 'Mon Profile',
    icon: 'bi bi-hdd-stack',
    class: '',
    extralink: false,
    submenu: []
  }*/

  {
    path: '/component/card',
    title: 'Planning',
    icon: 'bi bi-card-text',
    class: '',
    extralink: false,
    submenu: [],
    roles:['SALARIE','ADMIN']

  },
  {
    path: '/component/dropdown',
    title: 'Salarié et contrat',
    icon: 'bi bi-menu-app',
    class: '',
    extralink: false,
    submenu: [],
    roles:['ADMIN']

  },
  {
    path: '/component/pagination',
    title: 'Catalogue',
    icon: 'bi bi-dice-1',
    class: '',
    extralink: false,
    submenu: [],
    roles:['ADMIN','SALARIE']

  },
  // {
  //   path: '/component/nav',
  //   title: 'Ajouter Module',
  //   icon: 'bi bi-pause-btn',
  //   class: '',
  //   extralink: false,
  //   submenu: [],
  //   roles:['ADMIN']

  // },
  {
    path: '/component/table',
    title: 'Sessions',
    icon: 'bi bi-layout-split',
    class: '',
    extralink: false,
    submenu: [],
    roles:['ADMIN']

  },

  {
    path: '/modules',
    title: 'testCOmponent',
    icon: 'bi bi-layout-split',
    class: '',
    extralink: false,
    submenu: [],
    roles:[]

  },
  // {
  //   path: '/about',
  //   title: 'About',
  //   icon: 'bi bi-people',
  //   class: '',
  //   extralink: false,
  //   submenu: [],
  //   roles:['ADMIN']

  // }
];
