import { HomeRounded, SettingsRounded, ViewListRounded, AddCard, PostAddRounded, ReceiptRounded, HistoryRounded, PointOfSaleOutlined, AnalyticsRounded, NoteAdd, MenuBook, LocalPharmacy, MonetizationOn } from "@mui/icons-material"

//Sharp Icon Set
import CalculateSharpIcon from '@mui/icons-material/CalculateSharp';
import OtherHousesSharpIcon from '@mui/icons-material/OtherHousesSharp';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import FileCopySharpIcon from '@mui/icons-material/FileCopySharp';
import ReceiptLongSharpIcon from '@mui/icons-material/ReceiptLongSharp';
import PostAddSharpIcon from '@mui/icons-material/PostAddSharp';
import OutdoorGrillSharpIcon from '@mui/icons-material/OutdoorGrillSharp';
import NoteAddSharpIcon from '@mui/icons-material/NoteAddSharp';
import LibraryAddSharpIcon from '@mui/icons-material/LibraryAddSharp';
import InsightsSharpIcon from '@mui/icons-material/InsightsSharp';
import AutoGraphSharpIcon from '@mui/icons-material/AutoGraphSharp';
import AutoAwesomeSharpIcon from '@mui/icons-material/AutoAwesomeSharp';
import PhotoFilterSharpIcon from '@mui/icons-material/PhotoFilterSharp';
import TipsAndUpdatesSharpIcon from '@mui/icons-material/TipsAndUpdatesSharp';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';

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

const iconSize = '25px';

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
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
    }
]