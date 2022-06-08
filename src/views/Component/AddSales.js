import {
	AppBar, Button, Card, Container, Dialog, DialogActions, DialogContent, Divider, FormControl, FormControlLabel,
	Grid, IconButton, InputLabel, MenuItem, Select, Slide, Switch, Table, TableBody, TableCell, TableHead,
	TableRow, TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import clientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";
import AuthContext from "./../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddSales(props) {
	const classes = useStyles();
	
	const { currentUser } = React.useContext(AuthContext);
	const { apiRequest } = React.useContext(clientContext);
	
	const [open, setOpen] = React.useState(false);
	const [stock, setStock] = React.useState([{}]);
	const [alertFormDiscount, setAlertFormDiscount] = React.useState(false);
	const [value, setValue] = React.useState([""]);
	const [inputValue, setInputValue] = React.useState("");
	const [payment, setPayment] = React.useState([]);
	const [amount, setAmount] = React.useState("");
	const [amountDiscount, setAmountDiscount] = React.useState("");
	const [percentage, setPercentage] = React.useState("");
	const [productList, setProductList] = React.useState([]);
	const [discount, setDiscount] = React.useState([]);
	const [dataOpenCart, setDataOpenCart] = React.useState({});
	
	const [state, setState] = React.useState({
		checkedA: true,
		checkedB: false,
	});
	const [data, setData] = React.useState({
		price: 0,
	});

	const handleClickOpen = () => { setOpen(true) };
	const handleClose = () => { setOpen(false) };

	const deletePreviusData = () => {
		setProductList([]);
		setDiscount([]);
		setData({ price: 0 });
		setState({});
		setValue([""]);
		setInputValue("");
		setAmount("");
	};

	const getCurrentPaymentID = (m) => {
		setData({
			...data,
			payment_id: m.id,
			discount: m.discount,
		});
	};

	const getPayment = () => {
		apiRequest("GET", `/payments/payment-by/${currentUser.companyProfiles[0].company_id}`)
			.then((res) => {
				setPayment(res);
			})
			.catch((err) => {
				alert("nao foi possivel pegar os Payment");
			});
	};

	const cartOpenPost = (e) => {
		let dataCart = {
			company_id: currentUser.companyProfiles[0].company_id,
		}
		apiRequest("POST", "/sales/", { ...dataCart })
			.then((res) => {
				setDataOpenCart(res);
				deletePreviusData();
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const cartDel = (e) => {
		apiRequest("DELETE", `/sales/${dataOpenCart.id}`)
			.then((res) => {
				setOpen(false);
			})
			.catch((err) => {});
	};

	const cartDelItemList = async (val) => {
		const dataVal = {
			stock_id: val.res.stock.id,
			sale_id: val.res.sale.id,
			price: val.res.product_added.price_unit,
			amount: val.res.product_added.amount,
		};

		apiRequest("PATCH", `/sales/item/0/delete`, { ...dataVal })
			.then((res) => {
				let removedProduct = productList.filter((item) => item !== val);
				setProductList(removedProduct);
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const cartAddItemList = (val) => {
		const AddCartItem = {
			sale_id: dataOpenCart.id,
			company_id: currentUser.companyProfiles[0].company_id,
			stock_id: value.id,
			amount: parseInt(amount),
		};

		if (!amount || !value) {
			alert("Escolha um produto e insira uma quantidade");
			return;
		}
		apiRequest("POST", "/sales/item", { ...AddCartItem })
			.then((res) => {
				setProductList([...productList, { res }]);
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	const postSale = () => {
		try {
			if (!Boolean(data.payment_id) && Boolean(String(data.sale_date).length)) {
			} else {
				const submitData = {
					...data,
					payment_id: data.payment_id,
					company_id: currentUser.companyProfiles[0].company_id,
				};
				apiRequest("POST", `/sales/${dataOpenCart.id}/finish`, {
					...submitData,
				})
					.then((res) => {
						setOpen(false);
						props.loadSale();
					})
					.catch((err) => {
						console.log("entrou no error dentro de postSale", err)
					});
			}
		} catch (err) {}
	};

	const getCurrentDate = (event) => {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	};

	const getStock = () => {
		apiRequest("GET", `/stock/all-by/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setStock(res);
		})
		.catch((err) => {});
	};

	const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });
	};

	const postDiscount = () => {
		try {
			if (!percentage || !amountDiscount) {
				setAlertFormDiscount(true);
			} else {
				const submitData = {
					...data,
					percentage: percentage,
					sale_id: dataOpenCart.id,
					amount: amountDiscount,
				};
				apiRequest("POST", `/discount`, {
					...submitData,
				})
					.then((res) => {

						setDiscount([...discount, { res }]);

						setAlertFormDiscount(false);
					})
					.catch((err) => {
						setAlertFormDiscount(true);
					});
			}
		} catch (err) {}
	};

	const delDiscount = (val) => {
		apiRequest("DELETE", `/discount/${val.res.id}`)
			.then((res) => {
				 let removedDiscount = discount.filter((item) => item !== val);
				setDiscount(removedDiscount);
			})
			.catch((err) => {});
	};

	React.useEffect(() => {
		getPayment();
		getStock();
		deletePreviusData();
	}, [])

	return (
		<div>
			<Button 
				fullWidth
				variant="contained" 
				color="primary" 
				style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
				onClick={() => {
					handleClickOpen();
					cartOpenPost();
				}}
			>
				Inserir venda
			</Button>

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
							onClick={() => {
								handleClose()
								cartDel()
							}}
						>
							<CloseIcon />
						</IconButton>
						<Typography 
							variant="h6" 
							style={{marginLeft: "3%", flex: 1}}
						>
							Adicionar uma Venda
						</Typography>
					</Toolbar>
				</AppBar>

				<DialogContent>
					<Container maxWidth="lg" className={classes.container}>

						<Typography
							style={{ marginTop: "1.5%" }}
							variant="h5" gutterBottom component="div"
						>
							Insira os dados para cadastrar uma venda
						</Typography>

						<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
							<Grid item xs={12} sm={12} md={3}>
								<Autocomplete
									fullWidth
									options={stock}
									inputValue={inputValue}
									value={value ? value : ""}
									onChange={(event, newValue) => { setValue(newValue) }}
									onInputChange={(event, newInputValue) => { setInputValue(newInputValue) }}
									getOptionLabel={(stock) => stock.product ? `${stock.product.name} :${stock.id}` : "" }
									renderInput={(params) => (
										<TextField
											fullWidth
											{...params}
											label="Produto:EstoqueID"
											variant="outlined"
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								<TextField
									fullWidth
									type="number"
									size="medium"
									variant="outlined"
									label="Quantidade"
									onChange={(e) => setAmount(e.target.value)}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								<FormControl fullWidth variant="outlined">
									<InputLabel htmlFor="outlined-type-native-simple">
										Tipo de Pagamento
									</InputLabel>
									<Select
										fullWidth
										value={data.id}
										variant="outlined"
										label="Tipo de Pagamento"
									>
										{payment && payment.map((m) => (
											<MenuItem
												key={m.id}
												value={m.id}
												onClick={(e) => { getCurrentPaymentID(m) }}
											>
												{m.type}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								<TextField
									fullWidth
									type="date"
									name="sale_date"
									variant="outlined"
									label="Data de entrada"
									placeholder="DD/MM/YYYY"
									value={data ? data.sale_date : ""}
									onChange={(e) => getCurrentDate(e)}
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
									onClick={() => { cartAddItemList() }}
								>
									Inserir produto
								</Button>
							</Grid>
						</Grid>

						<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
							<Grid item xs={12} sm={12} md={12}>
								<Card>
									<div className="table-responsive">
										<Table>
											<TableHead>
												<TableRow>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Produto</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Quantia</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço/unidade</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Estoque</TableCell>
													<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{(productList.length === 0) ? <TableRow>
													<TableCell style={{
														fontWeight: 'bold',
														opacity: 0.75, 
														whiteSpace: 'nowrap', 
														fontSize: 16, 
														color: '#4a4a4a'
													}}> 
														Nenhum produto inserido
													</TableCell>
												</TableRow>
												: productList && productList.map((val) => (
													<TableRow>
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}> 
															{val.res.product_added.name}
														</TableCell>
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}>
															{val.res.product_added.amount}
														</TableCell>
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}>
															{val.res.product_added.price_unit}
														</TableCell>
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}>
															{
																(val.res.stock.number)
																? val.res.stock.number
																: ""
															}	
														</TableCell>
														<TableCell style={{
															fontWeight: 'bold',
															opacity: 0.75, 
															whiteSpace: 'nowrap', 
															fontSize: 16, 
															color: '#4a4a4a'
														}}>
															<DeleteIcon
																style={{ cursor: "pointer" }}
																onClick={() => {
																	cartDelItemList(val);
																}}
															/>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</Card>
							</Grid>
						</Grid>

						<Grid container direction="row" style={{marginTop:"4%"}} xs={12} sm={12} md={12} spacing={3}>
							<Grid item xs={12} sm={12} md={3}>
								<Typography
									variant="h6" gutterBottom component="div"
								>
									Essa venda tem desconto?
								</Typography>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								<FormControl fullWidth>
									<FormControlLabel
										fullWidth
										label="Inserir desconto"
										control={
											<Switch
												color="primary"
												name="checkedB"
												onChange={handleChange}
												checked={state.checkedB}
											/>
										}
									/>
								</FormControl>
							</Grid>
						</Grid>
						{
							(state.checkedB === true)
							? <Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										type="number"
										variant="outlined"
										label="Porcentagem de desconto"
										InputLabelProps={{ shrink: true }}
										onChange={(e) => setPercentage(e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										type="number"
										variant="outlined"
										label="Quantidade"
										InputLabelProps={{ shrink: true }}
										onChange={(e) => setAmountDiscount(e.target.value) }
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<Button
										fullWidth
										color="primary"
										variant="outlined"
										style={{ borderRadius:8 }}
										error={alertFormDiscount}
										onClick={() => { postDiscount() }}
									>
										Inserir desconto
									</Button>
								</Grid>
							</Grid>
							: <div></div>
						}
						{
							(discount.length > 1)
							? <Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
								<Grid item xs={12} sm={12} md={12}>
									<Card>
										<div className="table-responsive">
											<Table>
												<TableHead>
													<TableRow>
														<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço</TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}>Porcentagem</TableCell>
														<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{discount && discount.map((val) => (
														<TableRow>
															<TableCell style={{
																fontWeight: 'bold',
																opacity: 0.75, 
																whiteSpace: 'nowrap', 
																fontSize: 16, 
																color: '#4a4a4a'
															}}>
																{val.res.amount}
															</TableCell>
															<TableCell style={{
																fontWeight: 'bold',
																opacity: 0.75, 
																whiteSpace: 'nowrap', 
																fontSize: 16, 
																color: '#4a4a4a'
															}}>
																{val.res.percentage}
															</TableCell>
															<TableCell style={{
																fontWeight: 'bold',
																opacity: 0.75, 
																whiteSpace: 'nowrap', 
																fontSize: 16, 
																color: '#4a4a4a'
															}}>
																<DeleteIcon
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		delDiscount(val);
																	}}
																/>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</Card>
								</Grid>
							</Grid>
							: <div></div>
						}
					</Container>
				</DialogContent>

				<DialogActions>
					<Grid container direction="row" xs={12} sm={12} md={12}>
						<Grid item xs={12} sm={12} md={9}></Grid>
						<Grid item xs={12} sm={12} md={3}>
							<Button 
								fullWidth
								color="primary" 
								variant="contained"
								style={{borderRadius: 8}}
								onClick={() => {postSale()}}
							>
								Registrar
							</Button>
						</Grid>
					</Grid>
				</DialogActions>
			
			</Dialog>
		</div>
	);
}
