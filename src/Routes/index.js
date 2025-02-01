import DefaultLayout from "~/components/Layout/DefaultLayout";
import LoginLayout from "~/components/Layout/LoginLayout";
import CardLayout from "~/components/Layout/CardLayout";
import PurchaseLayout from "~/components/Layout/PurchaseLayout";
import ModalAuthen from "~/pages/ModalAuthen";
import Purchase from "~/pages/Purchase";
import DetailBill from "~/pages/DetailBill";
import User from "~/pages/User"
import OTPAuthen from "~/pages/ModalAuthen/Authen.js"
const publicRoutes = [
    {path: '/user', component: User, layout: PurchaseLayout ,},
    {path: '/login', component: ModalAuthen, layout: LoginLayout ,},
    {path: '/login/OTPAuthen', component: OTPAuthen, layout: LoginLayout ,},
    {path: '/purchase', component: Purchase, layout: PurchaseLayout ,},
    {path: '/purchase/detail/:IdBill', component: DetailBill, layout: PurchaseLayout ,},
    {path: '/card', component: null, layout: CardLayout ,},
    {path: '/', component: null, layout: DefaultLayout ,},
]
export { publicRoutes }