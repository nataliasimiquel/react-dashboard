import {
	Card, CardContent, CircularProgress, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow, Toolbar, Typography
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";
import AddPayment from "../Component/AddPayment";
import TableTitle from "../Component/custom/TableTitle";
import AuthContext from './../../contexts/AuthContext';
import DeletePayment from "./../Component/DeletePayment";

export default function Payments(props) {
	const { loading = false, error = null } = props;

	const { apiRequest } = React.useContext(ClientContext);
	const {currentUser} = React.useContext(AuthContext);
	
	const [paymentSelected, setPaymentSelected] = React.useState([]);
	const [alert, setAlert] = React.useState(undefined);
	const [success, setSucess] = React.useState(undefined);
	const [loadingPayMethods, setLoadingPayMethods] = React.useState([]);
	const [errorMessage, setErrorMessage] = React.useState("");

	const getPayments = (value) => {
		setPaymentSelected([...paymentSelected, value])
	}
 
	const getError = (err) => {
		console.log((err.message))
		setErrorMessage(err.message)
	}

	const loadPayMethods = () => {
		if (success === 1) { setAlert(1) }
		if (success === 2) { setAlert(2) }
		
		apiRequest("GET", `/payments/payment-by/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setLoadingPayMethods(res);
		})
		.catch((err) => {
			console.log("nao conseguiu carregar o Tipo de Pagamento", err);
		});
	}; 
	 
	React.useEffect(() => {
		loadPayMethods()
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		loadPayMethods();
	},[success]); // eslint-disable-line react-hooks/exhaustive-deps

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
								<Grid item xs={12} sm={12} md={6}>
									<TableTitle title={"Pagamentos"}/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}></Grid>
								<Grid item xs={12} sm={12} md={3}>
									<AddPayment 
										getError={(err) => getError(err)} 
										loadPayMethods={() => {loadPayMethods()}}
										setAlert={setAlert}  
										setSucess={setSucess}
									/>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Método de Pagamento</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Desconto</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(loadingPayMethods.length === 0) ? <TableRow>
									<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}>
										<Typography style={{color: 'black'}}>
											Nenhum método encontrado
										</Typography>
									</TableCell>
								</TableRow>
								:loadingPayMethods.map(payments => (
									<TableRow> 
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Typography style={{color: 'black'}}>
												{payments.type}
											</Typography>
										</TableCell>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Grid container direction="row" xs={12} sm={12} md={12}>
												<Grid item xs={12} sm={12} md={2}>
													<Typography style={{color: 'black', textAlign: "center"}}>
														{payments.discount}%
													</Typography>
												</Grid>
											</Grid>
										</TableCell>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}> 
											<DeletePayment 
												isOpen={false}
												getError={getError} 
												setAlert={setAlert} 
												setSucess={setSucess} 
												payments_id={payments.id} 
												loadPayMethods={() => {loadPayMethods()}} 
											/>
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
}


 