//Outlined Icon set
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import OutdoorGrillOutlinedIcon from '@mui/icons-material/OutdoorGrillOutlined';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

const iconSize = '25px';

export const SidebarData = [
    {
        title: 'Home',
        path: '/home',
        icon: <HomeOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Food Cost',
        path: '/foodcost',
        icon: <CalculateOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Margin',
        path: '/margin',
        icon: <MonetizationOnOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Ingredients',
        path: '/ingredients',
        icon: <ShoppingCartOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Invoices',
        path: '/invoices',
        icon: <ReceiptLongOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Add Invoice',
        path: '/add-invoice',
        icon: <PostAddOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Recipe Book',
        path: '/menu',
        icon: <OutdoorGrillOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Add Recipe',
        path: '/menubuilder',
        icon: <LibraryAddOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Billing',
        path: '/pos-simulator',
        icon: <ReceiptOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    // {
    //     title: 'Purchase History',
    //     path: '/purchasehistory',
    //     icon: <HistoryRounded sx={{ fontSize: '22px' }} />,
    // },
    {
        title: 'Insights - Sales',
        path: '/analytics-sales',
        icon: <AutoGraphOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Insights - Purchase',
        path: '/analytics-purchases',
        icon: <TipsAndUpdatesOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Settings',
        path: '/settings/user-profile',
        icon: <ManageAccountsOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Onboard Restaurant',
        path: '/superadmin/onboarding',
        icon: <AddBusinessOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Manage Restaurants',
        path: '/superadmin/restaurants',
        icon: <ManageAccountsOutlinedIcon sx={{ fontSize: iconSize }} />,
    },
    {
        title: 'Manage Users',
        path: '/superadmin/users',
        icon: <GroupOutlinedIcon sx={{ fontSize: iconSize }} />,
    }
]