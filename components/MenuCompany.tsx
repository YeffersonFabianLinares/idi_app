import { Menu } from "@/interfaces/Menu";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export const MenuCompany: Menu[] = [
    {
        id: 1,
        title: 'Entrega de resultados',
        subtitle: 'Consulta y descarga tus exámenes médicos',
        icon: <MaterialCommunityIcons name="list-box" size={30} color="white" />,
        color: '',
        link: '/company/results/Page'
    },
    {
        id: 2,
        title: 'Consulta de citas',
        subtitle: 'Consulta y descarga tus exámenes médicos',
        icon: <AntDesign name="file-search" size={30} color="white" />,
        color: '',
        link: '/company/appoinments/ShowAppoinments'
    },
    {
        id: 3,
        title: 'Agenda tu cita',
        subtitle: 'Consulta y descarga tus exámenes médicos',
        icon: <MaterialCommunityIcons name="file-edit-outline" size={30} color="white" />,
        color: '',
        link: '/citas/FormAppoinment'
    }
]