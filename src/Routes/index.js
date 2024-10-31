// Layout
import DefaultLayout from "~/components/Layout/DefaultLayout";
import AdminLayout from "~/components/Layout/AdminLayout";
import MobileLayout from "~/components/Layout/MobileLayout1";
import Order from "~/components/Layout/MobileLayout";
import CardLayout from "~/components/Layout/CardLayout";
import Purchase from "~/components/Layout/Purchase";
import LogInAdmin from "~/components/Layout/LoginAdmin";
import LogInUser from "~/components/Layout/LoginUser";
// Page
import Dashboard from "~/pages/Dashboard";
import Home from "~/pages/Home";
import PurchasePage from "~/pages/Purchase";
import Detailbill from "~/pages/Detailbill";
import ModalAuthen from "~/pages/ModalAuthen";
import ModalAuthenOTP from "~/pages/ModalAuthen/OTPAuthen";
// Product
import showProduct from "~/pages/Product/showProduct";
import showSlider from "~/pages/Slider/showSlider";
import Open from "~/pages/Open/index.js";
import showDetailProduct from "~/pages/DetailProduct/showDetailProduct";
import showVoucher from "~/pages/Voucher/index";
// Acc
import ShowAcc from "~/pages/Account/showAcc";
import showBill from "~/pages/Bill/index";
import showComment from "~/pages/Comment/index";
import User from "~/pages/User/index";
// Categori
import showCategori from "~/pages/Categoris/showCategoris";
import showMenu from "~/pages/Menu/showMenu";
import createQr from "~/pages/CreateQR";
// Type
import showType from "~/pages/Type/showTypes";
import detailType from "~/pages/DetailType/showDetailType";
import showTable from "~/pages/Table";
// Mobile
import HomeMobile from "~/pages/HomeMobile2";
import HomeOrder from "~/pages/HomeMobile";
import CardMobile from "~/pages/CardMobile2";
import OrderCard from "~/pages/CardMobile";
import DetailBillMobile from "~/pages/DetaiBillMobile";


import BillMobileOrder from "~/pages/BillMobileOrder";
import DetaiProductMobile from "~/pages/DetailProductMobile";
const publicRoutes = [
    // Product
    {path: '/showproduct', component: showProduct, layout: AdminLayout ,},
    {path: '/showdetailproduct', component: showDetailProduct, layout: AdminLayout ,},
    {path: '/showvoucher', component: showVoucher, layout: AdminLayout ,},
    {path: '/showbill', component: showBill, layout: AdminLayout ,},
    {path: '/showbill/:Bill', component: showBill, layout: AdminLayout ,},
    // Type
    {path: '/showtypes', component: showType, layout: AdminLayout ,},
    {path: '/showdetailtype', component: detailType, layout: AdminLayout ,},
    // Categori
    {path: '/showcategori', component: showCategori, layout: AdminLayout ,},
    // User
    {path: '/card', component: Home, layout: CardLayout ,},
    {path: '/user', component: User, layout: Purchase ,},
    {path: '/loginuser', component: ModalAuthen, layout: LogInUser ,},
    {path: '/loginuser/authenotp', component: ModalAuthenOTP, layout: LogInUser ,},
    {path: '/comment', component: showComment, layout: AdminLayout,},
    // Main
    {path: '/card', component: Home, layout: CardLayout ,},
    {path: '/purchase', component: PurchasePage, layout: Purchase ,},
    {path: '/purchase/:IdBill', component: Detailbill, layout: Purchase ,},
    {path: '/showmenu', component: showMenu, layout: AdminLayout ,},
    {path: '/showslider', component: showSlider, layout: AdminLayout ,},
    {path: '/open', component: Open, layout: AdminLayout ,},
    {path: '/showtable', component: showTable, layout: AdminLayout ,},
    {path: '/createqr', component: createQr, layout: AdminLayout ,},
    {path: '/admin', component: Dashboard, layout: AdminLayout ,},
    {path: '/admin/login', component: Home, layout: LogInAdmin ,},
    {path: '/', component: Home, layout: DefaultLayout ,},
]
const mobileRoutes = [
        {path: '/', component: HomeMobile, layout: MobileLayout ,},
        {path: '/detailbill', component: DetailBillMobile, layout: MobileLayout ,},
        {path: '/cardmobile', component: CardMobile, layout: MobileLayout ,},
        {path: '/mobile/billorder', component: BillMobileOrder, layout: MobileLayout ,},
        // Order
        // {path: '/mobile/card', component: CardMobile, layout: MobileLayout ,},
        {path: '/order/buffe/:IdType/order/billorder', component: BillMobileOrder, layout: MobileLayout ,},
        {path: '/order/detail/:IdProduct', component: DetaiProductMobile, layout: MobileLayout ,},
        {path: '/order/buffe/:IdType', component: HomeOrder, layout: Order,},
        {path: '/order/card', component: OrderCard, layout: MobileLayout ,},
]
export { publicRoutes, mobileRoutes }