import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import ClientContext from "../../contexts/ClientContext";
import {Button, Grid, IconButton, Modal, Typography, Tooltip} from "@material-ui/core";
	
export default function DeleteClient (props) {
	const {apiRequest} = React.useContext(ClientContext);

	const [open, setOpen] = React.useState(false);

	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);

	const deleteSales = (e) => {
		apiRequest("DELETE", `/sales/${props.sale.id}`)
		.then((res) => {
			handleClose();
			props.loadSale();
		})
		.catch((err) => {
		});
	};

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
									style={{ width: "90%", marginTop: "4%", textAlign: "center", color: 'black'}}
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
										deleteSales(e)
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