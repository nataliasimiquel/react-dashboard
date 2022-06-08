import {
	Button,
	Grid,
	TableBody,
	Modal,
	Table,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Card,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import moment from "moment";
import React from "react";
import { Colors, formatReais } from "../../util/Util";

const AddSales = (props) => {
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			<Button onClick={handleOpen}>
				<SettingsOverscanIcon />
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

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12} spacing={1}>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="h5"
								style={{ color: Colors.primary, width: "90%" }}
							>
								Informações da venda
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="subtitle"
								style={{ color: 'black', width: "90%" }}
							>
								ID da venda: {props.sale.id}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="subtitle"
								style={{ color: 'black', width: "90%" }}
							>
								Forma de pagamento: {props.sale.payments && props.sale.payments.method.type}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="subtitle"
								style={{ color: 'black', width: "90%" }}
							>
								Data de venda: {moment(props.sale.sale_date).format("DD/MM/yyyy")}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="subtitle"
								style={{ color: 'black', width: "90%" }}
							>
								Preço Total: {formatReais(props.sale.price)}
							</Typography>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12} spacing={2}>
						<Card fullWidth style={{ width: "90%" }}>
							<div className="table-responsive">
								<Table fullWidth style={{ width: "90%" }}>
									<TableHead>
										<TableRow>
											<TableCell style={{fontSize: 18, color: Colors.primary}}>ID lote</TableCell>
											<TableCell style={{fontSize: 18, color: Colors.primary}}>Produtos</TableCell>
											<TableCell style={{fontSize: 18, color: Colors.primary}}>Quantidade</TableCell>
											<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{props.sale && props.sale.salesStock.map((val) => (
											<TableRow>
												<TableCell style={{
													fontWeight: 'bold',
													opacity: 0.75, 
													whiteSpace: 'nowrap', 
													fontSize: 16, 
													color: '#4a4a4a'
												}}>
													<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
														{val.stock.product.id} 
													</Typography>
												</TableCell>
												<TableCell style={{
													fontWeight: 'bold',
													opacity: 0.75, 
													whiteSpace: 'nowrap', 
													fontSize: 16, 
													color: '#4a4a4a'
												}}>
													<Typography gutterBottom style={{fontSize: 14, color: 'black'}}>
														{val.stock.product.name}
													</Typography>
												</TableCell>
												<TableCell style={{
													fontWeight: 'bold',
													opacity: 0.75, 
													whiteSpace: 'nowrap', 
													fontSize: 16, 
													color: '#4a4a4a'
												}}>
													<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
														{val.amount}
													</Typography>
												</TableCell>
												<TableCell style={{
													fontWeight: 'bold',
													opacity: 0.75, 
													whiteSpace: 'nowrap', 
													fontSize: 16, 
													color: '#4a4a4a'
												}}>
													<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
														{formatReais(val.stock.product.price)}/u 
													</Typography>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</Card>
					</Grid>
				</div>

			</Modal>
		</div>
	);
};
export default AddSales;
