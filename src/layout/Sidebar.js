import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import ClientContext from "../contexts/ClientContext";
import { Colors } from "../util/Util";  
import moment from 'moment';

export default function Sidebar(){
    const { apiRequest } = React.useContext(ClientContext);
    const {resources} = React.useContext(AuthContext)

    const [activeMenu, setActiveMenu] = React.useState(null)

    const [contentsTypes, setContentsTypes] = React.useState([]);
    const [formContents, setFormContents] = React.useState([]);

    const getContentsTypes = () => {
        apiRequest("GET", `/contents/all-types`)
        .then((res) => {
            setContentsTypes(res.filter(i => (i.visible === true) && (i.format == "content")).sort((a,b) => moment(a.created_at).format() > moment(b.created_at).format() ? -1 : 1))
            setFormContents(res.filter(c => c.format == "form").sort((a,b) => moment(a.created_at).format() > moment(b.created_at).format() ? -1 : 1))
        })
        .catch((err) => {
            console.log("nao conseguiu carregar os conteudos", err);
        });
    }

    const handleOpenMenu = key => e => {
        const _this = $(e.target).closest("a")
        if($(_this).parent().hasClass('submenu')) {
            e.preventDefault();
        }
        if(!$(_this).hasClass('subdrop')) {
            $('ul', $(_this).parents('ul:first')).slideUp(350);
            $('a', $(_this).parents('ul:first')).removeClass('subdrop');
            $(_this).next('ul').slideDown(350);
            $(_this).addClass('subdrop');
        } else if($(_this).hasClass('subdrop')) {
            $(_this).removeClass('subdrop');
            $(_this).next('ul').slideUp(350);
        }
    }

    const menus = [
        resources["dashboard"] && {
            title: "",
            items: [
                {title: 'Produtos', className: 'fa fa-cart-plus', options: [
                    resources["dashboard"] && {to: '/categorias', title: 'Categorias'},
                    resources["dashboard"] && {to: '/produtos', title: 'Produtos'},
                    resources["dashboard"] && {to: '/estoque', title: 'Estoque'},
                    //resources["dashboard"] && {to: '/vendas', title: 'Vendas'},
                    resources["dashboard"] && {to: '/promocao', title: 'Promoção'},
                    resources["dashboard"] && {to: '/cupom', title: 'Cupons'},
                    resources["dashboard"] && {to: '/entregas', title: 'Entregas'},
                    resources["dashboard"] && {to: '/popups', title: 'PopUps'},
                ]},
            ]
        },
        resources["contents"] && contentsTypes.length > 0 && {
            title: "",
            items: [
                {title: 'Conteúdos', className: 'fa fa-file', options: (
                    contentsTypes.map((type) => {
                        return (
                            {to: `/conteudo/${type.uuid}`, title: `${type.title}`}
                        )
                    })
                )},
            ]
        },
        resources["contents"] && formContents.length > 0 && {
            title: "",
            items: [
                {title: 'Formulários', className: 'fa fa-file-text', options: (
                    formContents.map((type) => {
                        return (
                            {to: `/formularios/${type.uuid}`, title: `${type.title}`}
                        )
                    })
                )},
            ]
        },
        resources["dashboard"] && {
            title: "",
            items: [
                {title: 'Agendamento', className: 'fa fa-calendar', options: [
                    resources["dashboard"] && {to: '/salas', title: 'Salas'},
                    resources["dashboard"] && {to: '/servicos', title: 'Serviços'},
                    resources["dashboard"] && {to: '/servicos/salas', title: 'Serviços das salas'},
                    resources["dashboard"] && {to: '/agendamento', title: 'Agendamentos'},
                    resources["dashboard"] && {to: '/cliente', title: 'Clientes'},
                ]},
            ]
        },
        /* resources["orders"] && {
            title: "",
            items: [
                {title: 'Pedidos', className: 'fa fa-list', options: [
                    resources["orders.calc"] && {to: '/pedidos/calculo', title: 'Para cálculo'},
                    resources["orders.print"] && {to: '/pedidos/impressao', title: 'Para impressão'},
                ]},
            ]
        }, */
        resources["configs"] && {
            title: "",
            items: [
                {title: 'Configurações', className: 'fa fa-cogs', options: [
                    // resources["configs.printers"] && {to: '/configuracoes/impressoras', title: 'Impressoras'},
                    // resources["configs.orders"] && {to: '/configuracoes/pedidos', title: 'Pedidos'},
                    resources["configs.users"] && {to: '/configuracoes/usuarios', title: 'Usuários'},
                    // resources["configs.others"] && {to: '/configuracoes/outras', title: 'Outras'},
                    resources["dashboard"] && {to: '/parcelas', title: 'Parcelas'},
                    resources["dashboard"] && {to: '/pagamentos', title: 'Formas de pagamentos'},
                ]},
            ]
        },
    ]

    React.useEffect(() => { getContentsTypes() }, [])

    React.useEffect(() => {
        let newActiveMenu = null
        menus.filter(m => m).forEach((menu, indexOne) => {
            menu.items.filter(i => i).forEach((item, indexTwo) => {
                const indexActive = item.options.filter(i => i).map(opt => opt.to).indexOf(window.location.pathname)
                if(indexActive !== -1){ newActiveMenu = `${indexOne}-${indexTwo}` }
            })
        })
        setActiveMenu(newActiveMenu)

        setTimeout(() => {
            $('#sidebar-menu ul li.submenu a.active').parents('li:last').children('a:first').addClass('active').trigger('click');
        }, 1200)
    }, [window.location.pathname, menus])

    return <div 
        id="sidebar" 
        className="sidebar" 
        style={{background: Colors.secondary}}
    >
        <div 
            className="sidebar-inner slimscroll" 
            style={{
                display: 'flex', 
                flexDirection: 'column'
            }}
        >
            <div 
                id="sidebar-menu" 
                className="sidebar-menu" 
                style={{flex: 1, overflowY: "scroll"}}
            >
                <ul>
                    {
                        menus
                        .filter(item => item)
                        .map(({title, items}, indexOne) => [
                            <li className="menu-title"> 
                                <span>{title}</span>
                            </li>,
                            ...items
                            .filter(item => item)
                            .map(({title, options, className}, indexTwo) => (
                                <li className={`${indexOne}-${indexTwo}` === activeMenu ? 'active' : ''}>
                                    <a onClick={handleOpenMenu(`${indexOne}-${indexTwo}`)}>
                                        <i className={className}>
                                        </i> 
                                        <span>{title}</span> 
                                        <span className="menu-arrow">
                                        </span>
                                    </a>
                                    <ul>
                                        {
                                            options
                                            .filter(item => item)
                                            .map(opt => (
                                                <li className={
                                                    (opt.paths || [])
                                                    .includes(window.location.pathname) 
                                                        ? 'active' 
                                                        : ''
                                                }>
                                                    <Link to={opt.to}>{opt.title}</Link>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        ])
                    }
                </ul>
            </div>
            <div style={{padding: '10px 0', fontSize: 13, color: '#6a6a6a', textAlign: 'center'}}>Fridom</div>
        </div>
    </div>
}