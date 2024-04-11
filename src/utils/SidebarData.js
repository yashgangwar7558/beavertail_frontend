import { HomeRounded, SettingsRounded, ViewListRounded, AddCard, PostAddRounded, ReceiptRounded, HistoryRounded, PointOfSaleOutlined, AnalyticsRounded } from "@mui/icons-material"

export const SidebarData = [
    {
        title: 'Dashboard',
        path: '/',
        icon: <HomeRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Food Cost',
        path: '/foodcost',
        icon: <PointOfSaleOutlined sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Margin',
        path: '/margin',
        icon: <PointOfSaleOutlined sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Invoices',
        path: '/invoices',
        icon: <ReceiptRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Add Invoice',
        path: '/add-invoice',
        icon: <PostAddRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Recipe Book',
        path: '/menu',
        icon: <ViewListRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Add Recipe',
        path: '/menubuilder',
        icon: <AddCard sx={{ fontSize: '22px' }} />,
    },
    // {
    //     title: 'Purchase History',
    //     path: '/purchasehistory',
    //     icon: <HistoryRounded sx={{ fontSize: '22px' }} />,
    // },
    {
        title: 'Insights - Sales',
        path: '/analytics-sales',
        icon: <AnalyticsRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Insights - Purchase',
        path: '/analytics-purchases',
        icon: <AnalyticsRounded sx={{ fontSize: '22px' }} />,
    },
    {
        title: 'Settings',
        path: '/settings/user-profile',
        icon: <SettingsRounded sx={{ fontSize: '22px' }} />,
    }
]