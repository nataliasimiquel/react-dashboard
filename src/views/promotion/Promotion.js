import {
	Card, CardContent, CircularProgress, Divider, Grid, IconButton, Slide,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from '@material-ui/lab/Alert';
import moment from "moment";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import { Colors, formatReais } from "../../util/Util";
import AddPromotion from "../Component/AddPromotion";
import TableTitle from "../Component/custom/TableTitle";
import PromotionsInformation from "../Component/PromotionsInformation";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const Promotion = (props) => {
	const { loading = false, error = null } = props;

	const { currentUser } = React.useContext(AuthContext);
	const { apiRequest } = React.useContext(ClientContext);

	const [alert, setAlert] = React.useState(undefined);
	const [errorMessage, setErrorMessage] = React.useState("");

	const [loadingPromotion, setLoadingPromotion] = React.useState([]);
	
	const getPromotion = () => {
		apiRequest("GET", `/promotion/all/${currentUser.companyProfiles[0].company_id}`)
			.then((res) => {
				console.log({res})
				setLoadingPromotion(res);
			})
			.catch((err) => {
			});
	};

	const removePromotion = (value) => {
		const submitData = {company_id:currentUser.companyProfiles[0].company_id};
		apiRequest("PATCH", `/promotion/delete-promotion/${value.id}`, { ...submitData })
			.then((res) => {
				let removedWholesale = loadingPromotion.filter(
					(item) => item !== value
				);
				setLoadingPromotion(removedWholesale);
			})
			.catch((err) => {
			});
	};

	React.useEffect(() => {
		getPromotion();
	}, []);

	return (
		<div>
			{
				alert &&  ((alert === 1)
				? <Alert severity="success">Sucesso!</Alert>
				: <Alert severity="error">{errorMessage || "error"}</Alert>
				) 
			}

			<Card style={{marginTop:"2%"}}>
				{loading || error ? (
					<CardContent align="center">
						{loading ? (
						<CircularProgress />
						) : (
						<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
							{error}
						</div>
						)}
					</CardContent>
				) : (
					<div className="table-responsive">
						<Toolbar>
							<Grid 
								container 
								spacing={2}
								direction="row" 
								style={{
									marginTop:'1%', 
									marginBottom:3
								}} 
							>
								<Grid item xs={12} sm={12} md={9}>
									<TableTitle title={"Promoção"}/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<AddPromotion
										getPromotion={() => { getPromotion() }}
									/>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Tipo da Promoção</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>A partir de</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Nome do produto</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço/u</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Data inicial</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Data final</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Expandir</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Excluir</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(loadingPromotion.length === 0) ? <TableRow>
									<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}>
										<Typography style={{color: 'black'}}>
											Nenhuma promoção encontrada
										</Typography>
									</TableCell>
								</TableRow>
								:loadingPromotion.map((Promotion) => (
									<TableRow>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
												{Promotion.by_price ? "No Valor total da compra" : "Por Produto"}
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
												{(Promotion.by_price && Promotion.total_value) ? formatReais(Promotion.total_value) : "Não se aplica"}
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
												{Promotion.promotion_product.length > 0 ? Promotion.promotion_product[0].product.name : "-"}
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
												{Promotion.promotion_product.length > 0 ? formatReais(Promotion.promotion_product[0].price_unit) : "-"}
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
												{moment(Promotion.initial_date).format("DD/MM/yyyy")}
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
												{Promotion.final_date ? moment(Promotion.final_date).format("DD/MM/yyyy") : "-"}
											</Typography>
										</TableCell>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<PromotionsInformation promotion={Promotion}/>
										</TableCell>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Tooltip title="Deletar">
												<IconButton onClick={() => {
													removePromotion(Promotion)
												}}>
													<DeleteIcon
														fontSize="medium"
														style={{cursor:'pointer', color: 'black'}} 
														onClick={() => removePromotion(Promotion)}
													/>
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Promotion;
