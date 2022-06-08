import { AppBar, Button, Dialog, DialogActions, DialogContent, FormHelperText, Grid, IconButton, InputAdornment,
	MenuItem, Select, Slide, TextField, Toolbar, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import InputField from "../../commons/InputField";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const LinkShipping=(props)=> {
const { apiRequest } = React.useContext(ClientContext);

const [data, setData] = React.useState({});
const [open, setOpen] = React.useState(false);
const [error, setError] = React.useState({ 
	usuario: false, 
	email: false, 
	password: false, 
	passwordConfirmation: false, 
	name: false, 
	user: false, 
	createAt: false,
	dataNascimento: false,
	cpf: false,
	telefone: false,
	org: false,
	uf: false
});

const codigosServicos = [
	{id: '04014', text: "SEDEX à vista"},
	{id: '04065', text: "SEDEX à vista pagamento na entrega"},
	{id: '04510', text: "PAC à vista"},
	{id: '04707', text: "PAC à vista pagamento na entrega"},
	{id: '40169', text: "SEDEX12 ( à vista e a faturar)"},
	{id: '40215', text: "SEDEX 10 (à vista e a faturar)"},
	{id: '40290', text: "SEDEX Hoje Varejo"}
]

const formatoEncomenda = [
	{id: 1, text: "Formato caixa/pacote"},
	{id: 2, text: "Formato rolo/prisma"},
	{id: 3, text: "Envelope"}
]

const handleOpen = () => setOpen(true);
const handleClose = () => {setOpen(false); setData({})
setError({
	nCdServico: false, nCdFormato: false, 
	sCepOrigem: false, nVlPeso: false, 
	nVlComprimento: false, nVlAltura: false,
	nVlLargura: false, nVlDiametro: false
})}

const maskWeight = value => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{1})(\d)/, "$1.$2")
      .replace(/(\d{2})(\d)/, "")
};

const maskCm = value => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "")
};

const handleChangeData = (event) => {
	console.log("data", data)
	if(event.target.name === "nVlPeso") {
		setData({
			...data,
			[event.target.name]: maskWeight(event.target.value)
		})
	} else if(event.target.name === "nVlComprimento" || event.target.name === "nVlAltura"
	|| event.target.name === "nVlLargura" || event.target.name === "nVlDiametro") {
		setData({
			...data,
			[event.target.name]: maskCm(event.target.value)
		})
	} else {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	}	
};

const errorValidation = (data) => {
	setError({
		nCdServico: false, nCdFormato: false, 
		sCepOrigem: false, nVlPeso: false, 
		nVlComprimento: false, nVlAltura: false,
		nVlLargura: false, nVlDiametro: false
	})

	if (!data.nCdServico) { setError(e => ({...e,nCdServico:true})) }
	if (!data.nCdFormato) { setError(e => ({...e, nCdFormato:true})) }
	if (!data.sCepOrigem) { setError(e => ({...e, sCepOrigem:true})) }
	if (!data.nVlPeso) { setError(e => ({...e, nVlPeso:true})) }
	if (!data.nVlComprimento) { setError(e => ({...e, nVlComprimento:true})) }
	if (!data.nVlAltura) { setError(e => ({...e, nVlAltura:true})) }
	if (!data.nVlLargura) { setError(e => ({...e, nVlLargura:true})) }
	if (!data.nVlDiametro) { setError(e => ({...e, nVlDiametro:true})) }
}

const formatParams = () => {
	// var stringCep = data.sCepOrigem
	// let cep = stringCep.slice(0, 5) + stringCep.slice(6, stringCep.length) //removendo o "-" do cep 
	let peso = data.nVlPeso.toString().concat("kg")

	let params = {
		product_id: props.product_id,
		nCdServico: data.nCdServico,
		nCdFormato: data.nCdFormato,
		// sCepOrigem: parseInt(cep),
		nVlPeso: peso,
		nVlComprimento: parseFloat(data.nVlComprimento),
		nVlAltura: parseFloat(data.nVlAltura),
		nVlLargura: parseFloat(data.nVlLargura),
		nVlDiametro: parseFloat(data.nVlDiametro),
	}

	return params
}

const addShipping = () => {
	errorValidation(data)

	if(
		// !error.nCdServico && 
		!error.nCdFormato 
		// && !error.sCepOrigem 
		&& !error.nVlPeso 
		&& !error.nVlComprimento && !error.nVlAltura 
		&& !error.nVlLargura && !error.nVlDiametro) {

			let params = formatParams()

			apiRequest("POST", `/shipping/`, {...params})
			  .then((res) => {
				handleClose()
				props.setAlert(1)
				props.setSucess(1)
				props.loadProducts()
			  })
			  .catch((err) => {
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
				console.log("erro dentro de addShipping", err);
			  });
		}

}

const editShipping = () => {
	errorValidation(data)

	if (!error.nCdServico && !error.nCdFormato 
		&& !error.sCepOrigem && !error.nVlPeso 
		&& !error.nVlComprimento && !error.nVlAltura 
		&& !error.nVlLargura && !error.nVlDiametro) {

			let params = formatParams()
			
			apiRequest("PATCH", `/shipping/${data.id}`, {...params})
			  .then((res) => {
				handleClose()
				props.setAlert(1)
				props.setSucess(1)
				props.loadProducts()
			  })
			  .catch((err) => {
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
				console.log("erro dentro de editShipping", err);
			  });
		}
}

React.useEffect(() => {
	if(open === true && props.shipping) {
		let cepString = props.shipping.sCepOrigem.substring(0, 5) + "-" + props.shipping.sCepOrigem.substring(5, props.shipping.sCepOrigem.length) //removendo o "-" do cep 
		setData({
			...props.shipping,
			sCepOrigem: cepString,
			nVlPeso: parseFloat(props.shipping.nVlPeso)
		})
	}
},[open]);

return (
	<div>
		<Button 
			fullWidth 
			variant="contained" 
			color="primary"
			onClick={() => { handleOpen() }}
			style={{borderRadius:8 }}
		>
			{(props.shipping)?"Editar":"Adicionar"}
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
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography 
						variant="h6" 
						style={{marginLeft: "3%", flex: 1}}
					>
						Cadastro de frete
					</Typography>
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Grid container style={{margin:"1%"}} xs={12} sm={12} md={12}>
					<Grid item xs={12} sm={12} md={12}>
						<Typography 
							fullWidth
							variant="h5"
							style={{ color: Colors.primary }}
						>
							Insira os dados no formulário
						</Typography>
					</Grid>
				</Grid>
				<Grid container alignItems="flex-end" style={{margin:"1%"}} xs={12} sm={12} md={12} spacing={3}>
					{/* <Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Código do serviço
						</FormHelperText>
						<Select
							fullWidth 
							variant="outlined"
							defaultValue={'none'}
							value={data.nCdServico}
							onChange={handleChangeData}
							error={error.nCdServico}
							InputLabelProps={{ shrink: true }}
							inputProps={{ name: "nCdServico" }}
						>
							<MenuItem value={'none'}>Nenhum selecionado</MenuItem>
							{
								codigosServicos.map((item) => (
									<MenuItem value={item.id}>{item.text}</MenuItem>
								))
							}
						</Select>
						<FormHelperText 
							style={{marginLeft:"2%", color:"red"}}
						>
							{error.nCdServico ? "Insira o número do código" : ""}
						</FormHelperText>
					</Grid> */}
					<Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Formato do produto
						</FormHelperText>
						<Select
							fullWidth 
							variant="outlined"
							defaultValue={'none'}
							value={data ? data.nCdFormato : ""}
							onChange={handleChangeData}
							error={error.nCdFormato}
							InputLabelProps={{ shrink: true }}
							inputProps={{ name: "nCdFormato" }}
							
						>
							<MenuItem value={'none'}>Nenhum selecionado</MenuItem>
							{
								formatoEncomenda.map((item) => (
									<MenuItem value={item.id}>{item.text}</MenuItem>
								))
							}
						</Select>
						<FormHelperText 
							style={{marginLeft:"2%", color:"red"}}
						>
							{error.nCdFormato ? "Insira o formato" : ""}
						</FormHelperText>
					</Grid>
					{/* <Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Cep de origem
						</FormHelperText>
						<InputField
							fullWidth
							component="cep"
							name="sCepOrigem"
							error={error.sCepOrigem}
							onChange={(e) => {handleChangeData(e)}}
							value={data.sCepOrigem}
							InputLabelProps={{ shrink: true }}
							helperText={error.sCepOrigem ? "Insira o cep de origem" : ""}
						/>
					</Grid> */}
					<Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Valor peso 
							{
								(data.nCdFormato === 3)
								? " (máximo 1kg)"
								: ""
							}
						</FormHelperText>
						<TextField 
							fullWidth
							type="number" 
							name="nVlPeso" 
							variant="outlined" 
							//label="Valor peso" 
							error={error.nVlPeso}
							onChange={handleChangeData}
							value={data ? data.nVlPeso : ""}
							InputLabelProps={{ shrink: true }}
							helperText={error.nVlPeso ? "Insira o valor em peso" : ""}
							InputProps={{
								startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Comprimento do produto (em centímetros)
						</FormHelperText>
						<TextField 
							fullWidth 
							variant="outlined" 
							name="nVlComprimento" 
							type="text" 
							//label="Comprimento do produto" 
							value={data ? data.nVlComprimento : ""}
							onChange={handleChangeData}
							error={error.nVlComprimento}
							InputLabelProps={{ shrink: true }}
							helperText={error.nVlComprimento ? "Insira o comprimento do produto" : ""}
							InputProps={{
								startAdornment: <InputAdornment position="start">cm</InputAdornment>,
							}}
						/>
					</Grid>
					{
						(data.nCdFormato === 3) ? <div></div>
						: <Grid item xs={12} sm={12} md={4}>
							<FormHelperText 
								style={{marginLeft:"2%"}}
							>
								Altura do produto
							</FormHelperText>
							<TextField 
								fullWidth 
								variant="outlined" 
								name="nVlAltura" 
								type="text" 
								//label="Altura do produto" 
								value={data ? data.nVlAltura : ""}
								onChange={handleChangeData}
								error={error.nVlAltura}
								InputLabelProps={{ shrink: true }}
								helperText={error.nVlAltura ? "Insira a altura do produto" : ""}
								InputProps={{
									startAdornment: <InputAdornment position="start">cm</InputAdornment>,
								}}
							/>
						</Grid>
					}
					<Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Largura do produto
						</FormHelperText>
						<TextField 
							fullWidth 
							variant="outlined" 
							name="nVlLargura" 
							type="text" 
							//label="Largura do produto" 
							value={data ? data.nVlLargura : ""}
							onChange={handleChangeData}
							error={error.nVlLargura}
							InputLabelProps={{ shrink: true }}
							helperText={error.nVlLargura ? "Insira a largura do produto" : ""}
							InputProps={{
								startAdornment: <InputAdornment position="start">cm</InputAdornment>,
							}}
						/>
					</Grid>
					<Grid item xs={12} sm={12} md={4}>
						<FormHelperText 
							style={{marginLeft:"2%"}}
						>
							Diametro do produto
						</FormHelperText>
						<TextField 
							fullWidth 
							variant="outlined" 
							name="nVlDiametro" 
							type="text" 
							//label="Diametro do produto" 
							value={data ? data.nVlDiametro : ""}
							onChange={handleChangeData}
							error={error.nVlDiametro}
							InputLabelProps={{ shrink: true }}
							helperText={error.nVlDiametro ? "Insira o diametro do produto" : ""}
							InputProps={{
								startAdornment: <InputAdornment position="start">cm</InputAdornment>,
							}}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Grid container direction="row" xs={12} sm={12} md={12} spacing={1}>
					<Grid item xs={12} sm={12} md={3}>
						<Button 
							fullWidth
							color="primary" 
							variant="contained"
							style={{borderRadius: 8}}
							onClick={handleClose}
						>
							Cancelar
						</Button>
					</Grid>
					<Grid item xs={12} sm={12} md={6}></Grid>
					<Grid item xs={12} sm={12} md={3}>
						<Button 
							fullWidth
							color="primary" 
							variant="contained"
							style={{borderRadius: 8}}
							onClick={
								props.shipping
								? () => {editShipping()}
								: () => {addShipping()}
							} 
						>
							{props.shipping?"Editar":"Inserir"}
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Dialog>

	</div>
	);
	
}

export default LinkShipping;