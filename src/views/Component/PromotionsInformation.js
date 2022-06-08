import {
	Button, Card, Grid, Modal, Table, TableBody, TableCell,
	TableHead, TableRow,
	Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SettingsOverscanIcon from "@material-ui/icons/SettingsOverscan";
import React from "react";
import { Colors, formatReais } from "../../util/Util";

const PromotionsInformation = (props) => {
	const [open, setOpen] = React.useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const getDiscountType = (value) => {
		switch(value){
			case 1:
				return "Frete grátis";
			case 2:
				return "10% OFF";
			case 3:
				return "R$ 100 OFF";
		}
	}
	return (
		<div>
			<Button onClick={handleOpen} >
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
						<Grid item xs={12} sm={12} md={6}>
							<Typography 
								fullWidth
								variant="h5"
								style={{ color: Colors.primary, width: "90%" }}
							>
								Informações da promoção
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} md={6}>
							<Typography 
								fullWidth
								variant="subtitle"
								style={{ color: 'black', width: "90%" }}
							>
								Tipo: &nbsp; {(props.promotion.exact_amount) ?"Promoção":"Atacado" }
							</Typography>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
						<Grid item xs={12} sm={12} md={12}>

							<Card fullWidth style={{marginTop:"2%", width: "90%"}}>
								<div className="table-responsive">
									{
										props.promotion &&
										props.promotion.by_price
										?
										<Table fullWidth style={{ width: "90%" }}>
											<TableHead>
												<TableRow>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Tipo </TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Valor mínimo</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Desconto</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow> 
													<TableCell style={{
														fontWeight: 'bold',
														opacity: 0.75, 
														whiteSpace: 'nowrap', 
														fontSize: 16, 
														color: '#4a4a4a'
													}}>
														<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
															Valor mínimo em compras
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
															{formatReais(props.promotion.total_value)}
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
															{getDiscountType(props.promotion.by_price_type)}
														</Typography>
													</TableCell> 
												</TableRow> 
											</TableBody>
										</Table>
										:
										<Table fullWidth style={{ width: "90%" }}>
											<TableHead>
												<TableRow>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Nome do produto</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço/u</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Quantidade</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
											{
												props.promotion && 
												props.promotion.promotion_product &&
												props.promotion.promotion_product.map((val) => (
													<TableRow> 
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}>
															<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
																{val.product.name}
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
																{formatReais(val.price_unit)}
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
																&nbsp;{val.amount}
															</Typography>
														</TableCell> 
													</TableRow> 
											))} 
											</TableBody>
										</Table>
									}
								</div>
							</Card>

						</Grid>
					</Grid>

				</div>

			</Modal>
		</div>
	);
};
export default PromotionsInformation;
