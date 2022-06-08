import {
	Card, CardContent, CircularProgress,
	Divider,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Toolbar,
	Typography
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import moment from "moment";
import React from "react";
import { Colors, formatReais } from "../../util/Util";
import TableTitle from "../Component/custom/TableTitle";
import AuthContext from "./../../contexts/AuthContext";
import ClientContext from "./../../contexts/ClientContext";
import AddSales from "./../Component/AddSales";
import DeleteSales from "./../Component/DeleteSales";
import SalesInformation from "./../Component/SalesInformation";

const Sale = (props) => {
	const { loading = false, error = null, products = [] } = props;

	const { apiRequest } = React.useContext(ClientContext);
	const { currentUser } = React.useContext(AuthContext);

	const [alert, setAlert] = React.useState(undefined);
	const [success, setSucess] = React.useState(undefined);
	const [errorMessage, setErrorMessage] = React.useState("");

	const [sale, setSale] = React.useState([]);

	const loadSale = () => {
		apiRequest("GET", `/sales/${currentUser.companyProfiles[0].company_id}`)
			.then((res) => {
				setSale(res);
			})
			.catch((err) => {
				console.log("nao conseguiu carregar os produtos", err);
			});
	};

	React.useEffect(() => {
		loadSale();
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
								<Grid item xs={12} sm={12} md={6}>
									<TableTitle title={"Vendas"}/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}></Grid>
								<Grid item xs={12} sm={12} md={3}>
									<AddSales loadSale={() => {loadSale()}}/>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>ID Venda</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Status</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Data</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Método de pagamento</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Expandir</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{ 
									(sale.length === 0) ? <TableRow>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Typography style={{color: 'black'}}>
												Nenhuma venda encontrada
											</Typography>
										</TableCell>
									</TableRow>
								 	: sale && sale.map((s) => (
										<TableRow>
											<TableCell style={{
												fontWeight: 'bold',
												opacity: 0.75, 
												whiteSpace: 'nowrap', 
												fontSize: 16, 
												color: '#4a4a4a'
											}}>
												<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
													{s.id}
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
													{s.status}
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
													{formatReais(s.price)}
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
													{moment(s.sale_date).format("DD/MM/yyyy")}
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
													{
														(s.payments === null)
														?'Método não escolhido'
														:s.payments.method.type
													}
												</Typography>
											</TableCell>
											<TableCell style={{
												fontWeight: 'bold',
												opacity: 0.75, 
												whiteSpace: 'nowrap', 
												fontSize: 16, 
												color: '#4a4a4a'
											}}>
												<SalesInformation sale={s}/>
											</TableCell> 
											<TableCell style={{
												fontWeight: 'bold',
												opacity: 0.75, 
												whiteSpace: 'nowrap', 
												fontSize: 16, 
												color: '#4a4a4a'
											}}>
												<DeleteSales  
													loadSale={() => {loadSale()}} 
													sale={s}  
												/>
											</TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
					</div>
				)}
			</Card>
		</div>
	);
};

export default Sale;
