import React from "react";
import Typography from "@material-ui/core/Typography";
import AuthContext from "../contexts/AuthContext";
import { Colors } from "../util/Util";  
import MenuIcon from '@material-ui/icons/Menu';

export default function Header({}) {
	const { currentUser, signOut } = React.useContext(AuthContext);

	return (
		<div 
			className="header" 
			style={{background: "linear-gradient(to right, #3398c4, #032d43)" }}
		>
			<a 
				id="toggle_btn" 
				href="#sidebar" 
			>
				<MenuIcon
					fontSize="large"
					style={{
						color:"#FFFFFF", 
						marginRight:20,
						marginLeft:5
					}}
				/>
				<span></span>
				<span></span>
				<span></span>
			</a>

			<div className="header-left">
				<a href="index.html" className="logo">
					<img 
						alt="" 
						height="60"
						style={{padding: '10px 0'}} 
						src="/assets/frdm-white.png" 
					/>
				</a>
			</div>

			{/* <div className="page-title-box">
				<Typography 
					style={{ 
						fontSize: 28,
						color: "black",
						marginBottom:10,
						fontWeight: 'bold',
					}}
				>
					Fridom Dashboard
				</Typography>
			</div> */}

			<a 
				id="mobile_btn" 
				className="mobile_btn" 
				href="#sidebar"
				style={{color:"#FFFFFF"}}
			>
				<i className="fa fa-bars"></i>
			</a>

			<ul className="nav user-menu">
				<li className="nav-item dropdown has-arrow main-drop">
					<a
						href="#"
						className="dropdown-toggle nav-link"
						data-toggle="dropdown"
						style={{color:"#B8CAE8"}}
					>
						<span className="user-img">
							<img src="assets/img/profiles/avatar-21.jpg" alt="" />
							<span className="status online"></span>
						</span>
						<span>
							{{ ...currentUser }.name
								? { ...currentUser }.name.split(" ")[0]
								: "Usuário"}
						</span>
					</a>
					<div className="dropdown-menu">
						<a className="dropdown-item" href="/configuracoes/usuarios">
							Usuários
						</a>
						<a className="dropdown-item" onClick={signOut}>
							Sair
						</a>
					</div>
				</li>
			</ul>

			<div className="dropdown mobile-user-menu">
				<a
					href="#"
					className="nav-link dropdown-toggle"
					data-toggle="dropdown"
					aria-expanded="false"
					style={{color:"#B8CAE8"}}
				>
					<i className="fa fa-ellipsis-v"></i>
				</a>
				<div className="dropdown-menu dropdown-menu-right">
					<a className="dropdown-item" onClick={signOut}>
						Sair
					</a>
				</div>
			</div>
		</div>
	);
}
