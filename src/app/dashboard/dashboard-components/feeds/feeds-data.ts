export interface Feed {
    class: string,
    icon: string,
    task: string,
    time: string
}

export const Feeds: Feed[] = [

    {
        class: 'bg-info',
        icon: 'bi bi-bell',
        task: '',
        time: 'Module'
    },
    {
        class: 'bg-success',
        icon: 'bi bi-hdd',
        task: 'Server #1 overloaded.',
        time: 'Organisme'
    },
    {
        class: 'bg-warning',
        icon: 'bi bi-bag-check',
        task: 'New order received.',
        time: 'Date'
    },
    {
        class: 'bg-danger',
        icon: 'bi bi-bell',
        task: 'New user registered.',
        time: '€'
    },
    {
        class: 'bg-primary',
        icon: 'bi bi-bag-check',
        task: 'You have new password.',
        time: 'Salle'
    },

]
