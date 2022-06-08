import React from 'react';
import Contents from './views/conteudos/Contents';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Users = React.lazy(() => import('./views/configs/Users'));
const Categories = React.lazy(() => import('./views/categories/Categories'));
const Products = React.lazy(() => import('./views/products/Products'));
const Stock = React.lazy(() => import('./views/stock/Stock'));
const Sale = React.lazy(() => import('./views/sale/Sale'));
const Payments= React.lazy(() => import('./views/payments/Payments'));
const Conteudos= React.lazy(() => import('./views/conteudos/Contents'));
const Rooms= React.lazy(() => import('./views/rooms/Rooms'));
const ServicesRooms= React.lazy(() => import('./views/ServicesRooms/ServicesRooms'));
const Service= React.lazy(() => import('./views/service/Service'));
const Client= React.lazy(() => import('./views/client/Client'));
const Schedules= React.lazy(() => import('./views/schedules/Schedules.js'));
const Promotion= React.lazy(() => import('./views/promotion/Promotion.js'));
const Forms= React.lazy(() => import('./views/formularios/Forms.js'));
const Instalments= React.lazy(() => import('./views/installments/Installments'));
const Coupons= React.lazy(() => import('./views/coupons/Coupons'));
const Shipping= React.lazy(() => import('./views/shipping/Shipping'));
const PopUps= React.lazy(() => import('./views/popups/PopUps'));

const routes = [
    { exact: true, path: '/', name: 'Home' },
    { exact: true, path: '/dashboard', name: 'Dashboard', component: Dashboard, paths: ['/dashboard'] },
    { exact: true, path: '/categorias', name: 'Categories', component: Categories, paths: ['/categorias'] },
    { exact: true, path: '/produtos', name: 'Products', component: Products, paths: ['/produtos'] },
    { exact: true, path: '/estoque', name: 'Stock', component: Stock, paths: ['/estoque'] },
    { exact: true, path: '/vendas', name: 'Sale', component: Sale, paths: ['/vendas'] },
    { exact: true, path: '/pagamentos', name: 'Formas de pagamento', component: Payments, paths: ['/pagamentos'] },
    { exact: true, path: '/conteudos', name: 'Conteúdos', component: Conteudos, paths: ['/conteudos'] },
    { exact: true, path: '/salas', name: 'Salas', component: Rooms, paths: ['/salas'] },
    { exact: true, path: '/servicos', name: 'servicos', component: Service, paths: ['/servicos'] },
    { exact: true, path: '/servicos/salas', name: 'Salas de servicos', component: ServicesRooms, paths: ['/servicos/salas'] },
    { exact: true, path: '/cliente', name: 'Cliente', component: Client, paths: ['/cliente'] },
    { exact: true, path: '/agendamento', name: 'Agendamento', component: Schedules, paths: ['/agendamentos'] },
    { exact: true, path: '/configuracoes/usuarios', name: 'Users', component: Users, paths: ['/configuracoes/usuarios'] },
    { exact: true, path: '/conteudo/:uuid', name: 'Contents', component: Contents, paths: ['/conteudo/:uuid'] },
    { exact: true, path: '/promocao', name: 'Promotion', component: Promotion, paths: ['/promocao'] },
    { exact: true, path: '/formularios/:uuid', name: 'Forms', component: Forms, paths: ['/formulario/:uuid'] },
    { exact: true, path: '/parcelas', name: 'Installments', component: Instalments, paths: ['/parcelas'] },
    { exact: true, path: '/cupom', name: 'Cupons', component: Coupons, paths: ['/cupom'] },
    { exact: true, path: '/entregas', name: 'Entregas', component: Shipping, paths: ['/entregas'] },
    { exact: true, path: '/popups', name: 'PopUps', component: PopUps, paths: ['/popups'] },
    
];

export default routes;
