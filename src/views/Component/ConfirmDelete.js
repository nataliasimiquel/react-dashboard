import {
	Button, Grid, IconButton, Modal, Tooltip, Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import ClientContext from "../../contexts/ClientContext";

export default function ConfirmDelete(props) {
	const {apiRequest} = React.useContext(ClientContext);

	const [open, setOpen] = React.useState(false);

	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);

	const deleteStock = (e) => {
		e.preventDefault();
		apiRequest("PATCH", `/stock/delete-stock/${props.stock_id}`)
			.then((res) => {
				handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadStock();
			})
			.catch((err) => {
				props.setAlert(2)
				props.setSucess(2)
			});
	}

	return (
		<div>
			<Tooltip title="Deletar">
				<IconButton onClick={() => {
					handleOpen()
				}}>
					<DeleteIcon 
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

						<Grid container xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={12}>
								<Typography 
									fullWidth
									variant="h5" 
									gutterBottom
									style={{width: "90%", marginTop: "4%", textAlign: "center", color: 'black'}}
								> 
									Tem certeza que deseja excluir?
								</Typography>
							</Grid>
						</Grid>

						<Grid container style={{marginTop:"2%"}} xs={12} sm={12} md={12} spacing={1}>
							<Grid item xs={12} sm={12} md={6}>
								<Button 
									fullWidth
									variant="contained" 
									size="medium"
									style={{width: "90%", color: 'black', borderRadius:8}}
									onClick={() => {handleClose();}}
								>
									Cancelar
								</Button>
							</Grid>
							<Grid item xs={12} sm={12} md={6}>
								<Button 
									fullWidth
									variant="contained" 
									color="primary" 
									size="medium"
									style={{width: "90%", borderRadius:8}}
									onClick={(e) => {
										deleteStock(e) 
										handleClose();
									}}
								> 
									Excluir
								</Button>
							</Grid>
						</Grid>

					</div>
				</div>
			</Modal>
		</div>
	);
}
