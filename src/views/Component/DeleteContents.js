import {
	Button, IconButton, Grid, Typography, Modal, Tooltip
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
	
const DeleteContents=(props)=> {
const { apiRequest } = React.useContext(ClientContext);

const [open, setOpen] = React.useState(false);

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const deletContens = () => {
	apiRequest("PATCH", `/contents/inactivate-post/${props.id}`)
	.then((res) => {
		props.refresh();
	})
	.catch((err) => {
		alert(err);
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
									style={{color: 'black', width: "90%", borderRadius:8}}
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
									style={{borderRadius:8, width: "90%"}}
									onClick={(e) => { 
										deletContens(e)
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

export default DeleteContents;