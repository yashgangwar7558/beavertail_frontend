import { HomeRounded, SettingsRounded, ViewListRounded, AddCard, ReceiptRounded, HistoryRounded, PointOfSaleOutlined } from "@mui/icons-material"

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/',
        icon: <HomeRounded sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Add Recipe',
        path: '/menubuilder',
        icon: <AddCard sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Recipe Book',
        path: '/menu',
        icon: <ViewListRounded sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Invoices',
        path: '/invoices',
        icon: <ReceiptRounded sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Purchase History',
        path: '/purchasehistory',
        icon: <HistoryRounded sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Food Cost',
        path: '/foodcost',
        icon: <PointOfSaleOutlined sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Margin',
        path: '/margin',
        icon: <PointOfSaleOutlined sx={{ fontSize: '25px' }} />,
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <SettingsRounded sx={{ fontSize: '25px' }} />,
    }
]