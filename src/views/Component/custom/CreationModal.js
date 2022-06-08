import {
	AppBar, Button, Card, CircularProgress, Container, Dialog, DialogActions, DialogContent, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Table, TableBody, TableCell,
	TableHead, TableRow, TextField, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React from "react";
import InputField from "../../../commons/InputField";
import AuthContext from "../../../contexts/AuthContext";
import ClientContext from "../../../contexts/ClientContext";
import { Colors } from "../../../util/Util";

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
								Cadastro de {props.title}
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
								Insira os dados para cadastrar um {props.title}
							</Typography>
							<Grid container direction="row" style={{marginTop:"1%"}} xs={12} sm={12} md={12} spacing={3}>
								{
									props.inputs &&
									props.inputs.length > 0 &&
									props.inputs.map((input) => {
										return <Grid item xs={12} sm={12} md={3}>
											<InputField
												{...input.inputProps}
												fullWidth
												name={input.name}
												value={{...input}.value}
												label={input.label}
												onChange={e => input.onChange(e)}
											/>
										</Grid>
									})
								}
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
