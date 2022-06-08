import {
	AppBar, Button, Card, CircularProgress, Container, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Table, TableBody, TableCell,
	TableHead, TableRow, TextField, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import React from "react";
import InputField from "../../commons/InputField";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
	const classes = useStyles();
	const { apiRequest } = React.useContext(ClientContext);
	const { currentUser } = React.useContext(AuthContext);
	
	const [open, setOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [amount, setAmount] = React.useState("");
	const [products, setProducts] = React.useState([]);
	const [productList, setProductList] = React.useState([]);
	const [data, setData] = React.useState({});

	const handleClose = () => { setOpen(false) }
	const handleOpen = () => { setOpen(true) }

	const getProducts = () => {
		apiRequest("GET", `/itens/all-products/${currentUser.companyProfiles[0].company_id}`)
			.then((res) => {
				setProducts(res);
			})
			.catch((err) => {
			});
	};

	const deleteProduct = (val) => {
		let removedProduct = productList.filter((item) => item !== val);
		setProductList(removedProduct);
	};

	const handleProductList = () => {
		if (!amount || !data.product_id || !data.price_unit) {
			alert("Preencha todos os campos corretamente");
			return;
		}
		setData({ ...data });
		setProductList([
			...productList,
			{
				initial_date: data.initial_date,
				final_date: data.final_date,
				price_unit: data.price_unit,
				amount: amount,
				product_id: data.product_id,
				product_name: data.product_name,
			},
		]);
	};

	const AddPromotion = () => {
		setLoading(true);
		const submitData = {
			company_id: currentUser.companyProfiles[0].company_id,
			exact_amount: data.exact_amount,
			initial_date: data.initial_date,
			final_date: data.final_date,
			products: productList,
			by_price:data.by_price,
			by_price_type:data.by_price_type,
			total_value:data.total_value
		};
		apiRequest("POST", "/promotion/add-promotion", { ...submitData })
			.then((res) => {
				setLoading(false);
				handleClose();
				props.getPromotion();
			})
			.catch((err) => {
				setLoading(false);
				alert(err);
			});
	};

	const getCurrentProduct = (m) => {
		setData({
			...data,
			product_id: m.id,
			product_name: m.name,
		});
	};

	const getCurrentDate = (event) => {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	};

	const getCurrentDateFinal = (event) => {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	};

	const handleChange = (event) => {
		let exact_amount=false 
		let by_price=false;
		switch(event.target.value){
			case 1:
				exact_amount = true;
				break;
			case 2:
				exact_amount = false;
				break;
			case 3:
				by_price=true;
				break;
		}
		setData({
			...data,
			exact_amount,
			by_price
		});
	};

	const deletePreviusData = () => {
		setProductList([]);
		setData({});
		setAmount("");
	};

	React.useEffect(() => {
		getProducts();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<Button 
				fullWidth
				variant="contained" 
				color="primary" 
				style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
				onClick={()=> {
					handleOpen()
					deletePreviusData() 
				}}
			>
				Inserir Promoção
			</Button>

			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={handleClose}
					TransitionComponent={Transition}
				>
					<AppBar style={{ position: 'relative' }}>
						<Toolbar>
							<IconButton
								edge="start"
								color="inherit"
								onClick={handleClose}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
							<Typography 
								variant="h6" 
								style={{marginLeft: "3%", flex: 1}}
							>
								Cadastro de promoção
							</Typography>
						</Toolbar>
					</AppBar>

					<DialogContent>
						<Container maxWidth="lg" className={classes.container}>

							<Typography
								style={{ marginTop: "1.5%" }}
								variant="h5" gutterBottom component="div"
							>
								Insira os dados para cadastrar um item da promoção
							</Typography>

							<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
							<Grid item xs={12} sm={12} md={6}>
									<FormControl fullWidth variant="outlined">
										<InputLabel>Tipo</InputLabel>
										<Select
											fullWidth 
											onChange={handleChange}
										>
											<MenuItem value="exact_amount"><em>Selecione o tipo </em></MenuItem>
											<MenuItem value={1}>Promoção</MenuItem>
											<MenuItem value={2}>Atacado</MenuItem>
											<MenuItem value={3}>Valor Mínimo em Compras</MenuItem>
										</Select>
									</FormControl>
								</Grid>
								{
									!data.by_price 
									&&
									<Grid container style={{padding:10}} xs={12} sm={12} md={12} spacing={3}>
										<Grid item xs={12} sm={12} md={3}>
											<FormControl fullWidth variant="outlined">
												<InputLabel htmlFor="outlined-type-native-simple">
													Produto
												</InputLabel>
												<Select 
													fullWidth
													value={data.id} 
													label="Produto"
												>
													{products && products.map((m) => (
														<MenuItem
															value={m}
															onClick={() => { getCurrentProduct(m) }}
														>
															{m.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Grid>
										<Grid item xs={12} sm={12} md={3}>
											<InputField
												fullWidth
												mask="money"	
												name="price_unit"
												value={{...data}.price_unit}
												label="Preço do Produto"
												onChange={
													e => setData({...data, [e.target.name]: e.target.value})
												}
											/>
										</Grid>
										<Grid item xs={12} sm={12} md={3}>
											<TextField
												fullWidth
												type="number"
												label="Quantia"
												variant="outlined"
												InputLabelProps={{ shrink: true }}
												onChange={(e) => setAmount(e.target.value)}
											/>
										</Grid>
										<Grid item xs={12} sm={12} md={3}>
											<TextField
												fullWidth
												variant="outlined"
												type="date"
												name="initial_date"
												label="Data inicial"
												placeholder="DD/MM/YYYY"
												value={data ? data.initial_date : ""}
												onChange={(e) => getCurrentDate(e)}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
										<Grid item xs={12} sm={12} md={3}>
											<TextField
												fullWidth
												variant="outlined"
												type="date"
												name="final_date"
												label="Data final"
												placeholder="DD/MM/YYYY"
												value={data ? data.final_date : ""}
												onChange={(e) => getCurrentDateFinal(e)}
												InputLabelProps={{ shrink: true }}
											/>
										</Grid>
										<Grid item xs={12} sm={12} md={9}>
											<Divider
												fullWidth
												style={{padding: "0.050%"}}
											/>
										</Grid>
										<Grid item xs={12} sm={12} md={3}>
											<Button
												fullWidth
												color="primary"
												variant="outlined"
												style={{ borderRadius:8 }}
												onClick={() => { handleProductList() }}
											>
												Inserir item
											</Button>
										</Grid>
									</Grid>
								}
							</Grid>
							{
								!data.by_price
								&&
							<Grid container direction="row" style={{marginTop:"2%"}} xs={12} sm={12} md={12}>
								<Grid item xs={12} sm={12} md={12}>
									<Card>
										<div className="table-responsive">
											<Table>
												<TableHead>
													<TableRow>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Produto </TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Quantia </TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Preço/u </TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Data inicial </TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Data final </TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}> Excluir </TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{productList && productList.map((val) => (
														<TableRow>
															<TableCell style={{
																fontWeight: 'bold',
																opacity: 0.75, 
																whiteSpace: 'nowrap', 
																fontSize: 16, 
																color: '#4a4a4a'
															}}> 
																<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
																	{val.product_name}
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
																	{val.price_unit}
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
																	{moment(val.initial_date).format("DD/MM/yyyy")}
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
																	{moment(val.final_date).format("DD/MM/yyyy")}
																</Typography>
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
																		deleteProduct(val)
																	}}>
																		<DeleteIcon
																			fontSize="medium"
																			style={{cursor:'pointer', color: 'black'}} 
																		/>
																	</IconButton>
																</Tooltip>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</Card>
								</Grid>
							</Grid>
							}
							{
								data.by_price &&
								<Grid container style={{}} xs={12} sm={12} md={12} spacing={3}>
									<Grid item xs={12} sm={12} md={6}>
										<InputField
											fullWidth
											mask="money"	
											name="total_value"
											value={{...data}.total_value}
											label="Valor mínimo em compras"
											helperText="Insira o valor mínimo em compras para ativar a promoção"
											onChange={
												e => setData({...data, [e.target.name]: e.target.value})
											}
										/>
									</Grid>
									<Grid item xs={12} sm={12} md={6}>
										<FormControl fullWidth variant="outlined">
											<InputLabel>Tipo de Desconto</InputLabel>
											<Select
												fullWidth 
												name="by_price_type"
												onChange={
													e => setData({...data, [e.target.name]: e.target.value})
												}
											>
												<MenuItem value="exact_amount"><em>Selecione o tipo do desconto </em></MenuItem>
												<MenuItem value={1}>Frete Grátis</MenuItem>
												<MenuItem value={2}>10% OFF</MenuItem>
												<MenuItem value={3}>R$10 OFF</MenuItem>
											</Select>
										</FormControl>
									</Grid>
								</Grid>
							}

						</Container>
					</DialogContent>
					
					<DialogActions>
						<Grid container direction="row" xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={9}></Grid>
							{
								loading
								?<CircularProgress />
								:
								<Grid item xs={12} sm={12} md={3}>
									<Button 
										fullWidth
										color="primary" 
										variant="contained"
										style={{borderRadius: 8}}
										onClick={AddPromotion}
									>
										Registrar
									</Button>
								</Grid>
							}
						</Grid>

					</DialogActions>

				</Dialog>
			</div>
		</div>
	);
}
