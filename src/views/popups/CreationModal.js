import {
	AppBar, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Switch, TextField, Toolbar, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";
import React from "react";
import InputField from "../../commons/InputField";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import FileUploader from "../Component/FileUploader/FileUploader";

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
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	

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
								Cadastro de PopUp
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
								Insira os dados para cadastrar um PopUp
							</Typography>
							<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
								<Grid item xs={12} sm={12} md={3}>
									<InputField
										fullWidth
										name="title"
										value={{...props.data}.title}
										label="Título"
										InputLabelProps={{ shrink: true }}
										onChange={e => props.onChange(e)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
									<InputField
										style={{}}
										fullWidth
										name="description"
										value={{...props.data}.description}
										label="Descrição"
										onChange={e => props.onChange(e)}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={12}>
								<FormControl
									className={classes.formControl}
									fullWidth
									variant="outlined"
								>
									<InputLabel>Vincule o PopUp a um cupom de desconto</InputLabel>
									<Select
										fullWidth
										name="coupon_id"
										value={{...props.data}.coupon_id}
										defaultValue={props.data.coupon_id}
										defaultChecked={1}
										onChange={e => props.onChange(e)}
									>
										{
											props.coupons.map((c) => {
												return(
													<MenuItem value={c.id}>{c.code}</MenuItem>

												)
											})
										}
									</Select>
								</FormControl>
								</Grid>
								
								<Grid item xs={12} sm={12} md={6} style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
									<FileUploader
										label={"+ imagem JPEG/PNG"}
										onChange={props.onLoadFile}
										style={{width: 400, height: 400}}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										variant="outlined"
										type="date"
										name="start_at"
										label="Data inicial"
										placeholder="DD/MM/YYYY"
										value={props.data ? props.data.start_at : ""}
										onChange={(e) => props.onChange(e)}
										InputLabelProps={{ shrink: true }}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<TextField
										fullWidth
										variant="outlined"
										type="date"
										name="end_at"
										label="Data final"
										placeholder="DD/MM/YYYY"
										value={props.data ? props.data.end_at : ""}
										onChange={(e) => props.onChange(e)}
										InputLabelProps={{ shrink: true }}
									/>
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
