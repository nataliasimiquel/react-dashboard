import { Button, Grid, IconButton, Modal, TextField, Tooltip, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";

export default function LossStock(props) {
	const {apiRequest} = React.useContext(ClientContext);
	const {currentUser} = React.useContext(AuthContext);

	const [data, setData] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState({
		amount:false,
		loss_date:false,
	});
	
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const onSubmit = (e) => {
		let formData = {
			amount: parseFloat(data.amount),
			loss_date: data.loss_date,
			stock_id: data.stock_id,
			company_id: data.company_id
		}
		if (!data.amount) {
			setError(e => ({...e,amount:true}))
		} else if (!data.loss_date) {
			setError(e => ({...e, loss_date:true}))
		} else {
			apiRequest("POST", `stock/post-loss`, {...formData})
			.then((res) => {
				setData([]);
				handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadStock();
			})
			.catch((err) => {
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
			});
		}
	}

	const handleChangeData = (event) => {
		setData({
			...data,
			stock_id:props.stockId,
			company_id: currentUser.companyProfiles[0].company_id,
			[event.target.name]: event.target.value,
		});
	};

	React.useEffect(() => {
		setData({})
	},[]);

	React.useEffect (() => {
		if (data.amount) {
			setError(e => ({...e,amount:false}))
		}
		if (data.loss_date) {
			setError(e => ({...e, loss_date:false}))
		}
	}, [data])  

	return (
		<div>
			<Tooltip title="Perda">
				<IconButton onClick={() => {
					handleOpen()
				}}>
					<TrendingDownIcon 
						fontSize="medium"
						style={{cursor:'pointer', color: 'black'}}  
					/>
				</IconButton>
			</Tooltip>
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
					<div style={{margin:"4%"}}>

						<CloseIcon 
							fontSize="medium"
							onClick={handleClose} 
							style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
						/>

						<Grid container xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={12}>
								<Typography 
									fullWidth
									variant="h5" 
									gutterBottom
									style={{ marginTop: "2%", textAlign: "center", color: 'black'}}
								> 
									Inserir perda do estoque
								</Typography>
							</Grid>
						</Grid>

						<Grid container style={{marginTop:"2%"}} xs={12} sm={12} md={12} spacing={1}>
							<Grid item xs={12} sm={12} md={12}>
								<TextField 
									fullWidth
									type="number" 
									variant="outlined" 
									name="amount" 
									label="Quantidade"
									value={data ? data.amount : ""}
									onChange={handleChangeData}
									error={error.amount}
									InputProps={{inputProps:{min:0}}}
									helperText={error.amount ? "Insira uma quantidade" : ""}
								/>
							</Grid>

							<Grid item xs={12} sm={12} md={12}>
								<TextField 
									fullWidth
									variant="outlined" 
									type="date" 
									name="loss_date" 
									label="Data da perda" 
									placeholder="DD/MM/YYYY"
									value={data ? data.loss_date : ""}
									onChange={(e)=> handleChangeData(e)}
									InputLabelProps={{shrink: true}}
									error={error.loss_date}
									helperText={error.loss_date ? "insira o cpf" : ""}
								/>
							</Grid>
						</Grid>

						<Grid container style={{marginTop:"2%", marginBottom:"1%"}} xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={12}>
								<Button
									fullWidth
									variant="contained" 
									color="primary" 
									style={{ borderRadius:8 }}
									onClick={(e) => {
										onSubmit(e)
										handleClose();
									}}
								>
									INSERIR
								</Button>
							</Grid>
						</Grid>
					</div>
					</div>
			</Modal>
		</div>
	);
}
