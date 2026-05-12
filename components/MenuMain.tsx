import { Menu } from '@/interfaces/Menu';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

export const MenuMain: Menu[] = [
    {
        id: 1,
        title: 'WADO',
        subtitle: 'Visualizador de imágenes',
        icon: <Ionicons name="cloud-download" size={30} color="white" />,
        color: '#ff9900',
        link: '/company/wado/ConsultaImagenes'
    },
    {
        id: 2,
        title: 'Usuarios',
        subtitle: 'Portal para pacientes',
        icon: <FontAwesome5 name="user-alt" size={26} color="white" />,
        color: '#ff9900',
        link: '/auth/Login',
        type: 'Paciente'
    },
    {
        id: 4,
        title: 'Citas',
        subtitle: 'Agendamientos de citas',
        icon: <MaterialCommunityIcons name="file-document-edit" size={30} color="white" />,
        color: '#ff9900',
        link: '/citas/FormAppoinment',
        type: 'diagnostica',
    },
];