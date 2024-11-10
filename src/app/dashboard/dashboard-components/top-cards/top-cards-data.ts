export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string

}

export const topcards: topcard[] = [

    {
        bgcolor: 'success',
        icon: 'bi bi-wallet',
        title: '',
        subtitle: 'Sessions Cloturées'    }
    ,
    {
        bgcolor: 'warning',
        icon: 'bi bi-basket3',
        title: '456',
        subtitle: 'Sessions non Cloturées'    },
    {
        bgcolor: 'danger',
        icon: 'bi bi-coin',
        title: '',
        subtitle: 'Côut maximale'
    },
    {
        bgcolor: 'info',
        icon: 'bi bi-bag',
        title: '',
        subtitle: 'Heures de formation'
    },

]
