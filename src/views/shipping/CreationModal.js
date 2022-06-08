import {
	AppBar, Button, Card, CircularProgress, Container, Dialog, DialogActions, DialogContent, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Switch, Table, TableBody, TableCell,
	TableHead, TableRow, TextField, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
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

export default function CreationModal(props) {
	const classes = useStyles();

	return (
		<div>
			<div>
				<Dialog
					fullScreen
					open={props.open}
					onClose={props.handleClose}
					TransitionComponent={Transition}
				>
					<AppBar style={{ position: 'relative' }}>
						<Toolbar>
							<IconButton
								edge="start"
								color="inherit"
								onClick={props.handleClose}
								aria-label="close"
							>
								<CloseIcon />
							</IconButton>
							<Typography 
								variant="h6" 
								style={{marginLeft: "3%", flex: 1}}
							>
								Cadastro de Endereço de Entrega
							</Typography>
						</Toolbar>
					</AppBar>

					<DialogContent>
						<Container maxWidth="lg" className={classes.container}>
							{props.error && <Alert severity="error">{props.errorMessage}</Alert>}
							<Typography
								style={{ marginTop: "1.5%" }}
								variant="h5" gutterBottom component="div"
							>
								Insira os dados para cadastrar um Endereço de Entrega
							</Typography>
							<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
								<Grid item xs={12} sm={12} md={3}>
									<InputField
										fullWidth
										name="cep"
										value={{...props.data}.cep}
										label="CEP de Origem"
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<InputField
										fullWidth
										name="country"
										value={{...props.data}.country}
										label="País"
										onChange={e => props.onChange(e)}
									/>
								</Grid>
								
								<Grid item xs={12} sm={12} md={3}>
									<InputField
										fullWidth
										name="uf"
										value={{...props.data}.uf}
										label="UF"
										onChange={e => props.onChange(e)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										label="Cidade"
										variant="outlined"
										name="city"
										value={{...props.data}.city}
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}								
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										label="Bairro"
										variant="outlined"
										name="neighborhood"
										value={{...props.data}.neighborhood}
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}									
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										label="Endereço"
										variant="outlined"
										name="address"
										value={{...props.data}.address}
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}									
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										label="Número"
										variant="outlined"
										name="number"
										value={{...props.data}.number}
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}									
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										label="Complemento"
										variant="outlined"
										name="complement"
										value={{...props.data}.complement}
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}									
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
								<FormControl fullWidth>
									<FormControlLabel
										fullWidth
										label="Este será seu endereço ativo para origem das entregas?"
										control={
											<Switch
												color="primary"
												name="main"
												onChange={e => props.onChange(e)}									
												value={{...props.data}.main}
												checked={props.data.main}
											/>
										}
									/>
								</FormControl>
							</Grid>
							</Grid>
						</Container>
					</DialogContent>
					
					<DialogActions>
						<Grid container direction="row" xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={9}></Grid>
							{
								props.loading
								? <CircularProgress />
								:
								<Grid item xs={12} sm={12} md={3}>
									<Button 
										disabled={props.loading}
										fullWidth
										color="primary" 
										variant="contained"
										style={{borderRadius: 8}}
										onClick={props.create}
									>
										Salvar
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
