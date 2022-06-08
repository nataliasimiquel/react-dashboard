import { Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";

export default function AddPayment(props) {
	const {apiRequest} = React.useContext(ClientContext);
	const {currentUser} = React.useContext(AuthContext);

	const [method, setMethod] = React.useState([]);
	const [data, setData] = React.useState({});
	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState(false);
 
	const handleOpen = () => {setOpen(true)};
	const handleClose = () => setOpen(false);

	const PaySelected = () => {
		if ((!data.discount)|| data.discount.length === 0) {
		 setError(true)
		}
		else {
			apiRequest("POST", "/payments/add-payment", {...data})
			.then((res) => {
				setData({});
				handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadPayMethods();
			})
			.catch((err) => {
				handleClose();
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
			});
		}
		
	};

	const getMethod = () => { 
		apiRequest("GET", "/payments/all-methods")
		.then((res) => { 
			setMethod(res)
		})
		.catch((err) => {
			alert(err);
		})
	}

	const handleChangeData = (event) => {
		setData({
			...data,
			company_id: currentUser.companyProfiles[0].company_id,
			[event.target.name]: event.target.value,
		});
		setError(false)

	};

	const getCurrentMethod = (m) => {
		setData({
			...data,
			method_id: m.id
		})
	}

	React.useEffect(() => { 
		getMethod() 
	},[]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<Button 
				fullWidth
				variant="contained" 
				color="primary" 
				style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
				onClick={handleOpen}
			>
				Novo pagamento
			</Button>

			<Modal 
				open={open} 
				onClose={handleClose} 
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<div style={{
					width: "35%",
					minWidth: 350,
					borderRadius: 10,
					position: "absolute",
					backgroundColor: 'white',
				}}>
					<CloseIcon 
						fontSize="medium"
						onClick={handleClose} 
						style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
					/>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="h5"
								style={{ color: Colors.primary, width: "90%" }}
							>
								Cadastrar Pagamento
							</Typography>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12} spacing={1}>
						<Grid item xs={12} sm={12} md={12}>
							<FormControl
								fullWidth 
								variant="outlined" 
								style={{ width: "90%" }}

							>
								<InputLabel htmlFor="outlined-age-native-simple">Métodos</InputLabel>
								<Select fullWidth value={data.id} label="Métodos">
									{method.map((m) => (
										<MenuItem 
											value={m}
											onClick={handleData => { getCurrentMethod(m) }}
										>
											{m.type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<TextField 
								fullWidth
								style={{width: "90%"}}
								variant="outlined" 
								name="discount" 
								type="number" 
								label="Porcentagem de desconto" 
								value={data ? data.discount : ""}
								onChange={handleChangeData}
								error={error}
								helperText={error ? "insira um desconto válido" : ""}
							/>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
						<Grid item xs={12} sm={12} md={12}>
							<Button
								fullWidth
								variant="contained" 
								color="primary" 
								style={{ borderRadius:8, width: "90%" }}
								onClick={() => PaySelected()} 
							>
								Inserir
							</Button>
						</Grid>
					</Grid>

				</div>
			</Modal>
		</div>
	);
}