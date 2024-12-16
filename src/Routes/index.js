// Layout
import DefaultLayout from "../components/Layout/DefaultLayout";
import MobileLayout from "../components/Layout/MobileLayout1";
import CardLayout from "../components/Layout/CardLayout";
import Purchase from "../components/Layout/Purchase";
import LogInUser from "../components/Layout/LoginUser";
// Page
import Home from "../pages/Home";
import PurchasePage from "../pages/Purchase";
import Detailbill from "../pages/Detailbill";
import ModalAuthen from "../pages/ModalAuthen";
import ModalAuthenOTP from "../pages/ModalAuthen/OTPAuthen";
// Product
import User from "../pages/User/index";
// Mobile
import HomeMobile from "../pages/HomeMobile2";
import LoginUser from "../pages/LoginUserMobile";
import CardMobile from "../pages/CardMobile2";
import InfoUser from "../pages/InfoUser";
import PurchaseMobile from "../pages/PurchaseMobile";
import DetailBillMobile from "../pages/DetaiBillMobile";
import ModalAuthenOTPMobile from "../pages/LoginUserMobile/AuthenOTP";
const publicRoutes = [
    // User
    {path: '/card', component: Home, layout: CardLayout ,},
    {path: '/user', component: User, layout: Purchase ,},
    {path: '/loginuser', component: ModalAuthen, layout: LogInUser ,},
    {path: '/loginuser/authenotp', component: ModalAuthenOTP, layout: LogInUser ,},
    // Main
    {path: '/card', component: Home, layout: CardLayout ,},
    {path: '/purchase', component: PurchasePage, layout: Purchase ,},
    {path: '/purchase/:IdBill', component: Detailbill, layout: Purchase ,},
    {path: '/', component: Home, layout: DefaultLayout ,},
]
const mobileRoutes = [
        {path: '/', component: HomeMobile, layout: MobileLayout ,},
        {path: '/loginuser', component: LoginUser, layout: MobileLayout ,},
        {path: '/loginuser/authenotp', component: ModalAuthenOTPMobile, layout: MobileLayout ,},
        {path: '/purchase/:IdBill', component: DetailBillMobile, layout: MobileLayout ,},
        {path: '/card', component: CardMobile, layout: MobileLayout ,},
        {path: '/user', component: InfoUser, layout: MobileLayout ,},
        {path: '/purchase', component: PurchaseMobile, layout: MobileLayout ,},
]
export { publicRoutes, mobileRoutes }