import {
	Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableCell,
	TableHead, TableRow, TextField, AppBar, Button,  Dialog, Divider, IconButton, Slide,
	Toolbar, Typography, Tooltip, TableBody, DialogActions, DialogContent, CircularProgress
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import InputField from "../../commons/InputField";
import ClientContext from "../../contexts/ClientContext";
import SunEditor from 'suneditor-react';
import { Colors } from "../../util/Util";
import AuthContext from './../../contexts/AuthContext';
import FileUploader from "./FileUploader/FileUploader";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProduct(props) {
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	const [data, setData] = React.useState([]);
	const [value, setValue] = React.useState({});
	const [contentsForm, setContentsForm] = React.useState({});

	const [loadFileError, setLoadFileError] = React.useState(null)
	const [loadFile, setLoadFile] = React.useState(false)

	const [open, setOpen] = React.useState(false);
	const [error, setError] = React.useState({ 
		name: false, 
		price: false, 
		subtitle: false, 
		description: false, 
		brand: false 
	});
	
	const handleClickOpen = () => { setOpen(true) };
	const handleClose = () => { setOpen(false) };

	const onLoadFile = (event) => {
		setLoadFile(true)
		setLoadFileError(null)

		let formData = new FormData();
		formData.append("File", event)

		apiRequest("POST", `/contents/file/admin-products`, formData)
		.then(res => { 
			if(!res.file) throw new Error("Falha ao salvar imagem");
			setData(v => ({...v, images: [...(v.images || []), res.file]}))
			setLoadFile(false)
		})
		.catch((err) => {
			setLoadFileError(err)
			setLoadFile(false)
		})
	}

	const editProduct = (e) => {
		setError({
			name: false, 
			price: false, 
			subtitle: false, 
			description: false, 
			brand: false
		})
		if (!data.name) { setError(e => ({...e,name:true})) }
		if (!value.price) { setError(e => ({...e, price:true})) }
		if (!data.subtitle) { setError(e => ({...e, subtitle:true})) }
		if (!contentsForm) { setError(e => ({...e, description:true})) }
		if (!data.brand) { setError(e => ({...e, brand:true})) }

		else if (!error.name && !error.price && !error.subtitle && !error.description && !error.brand) {
			const params = {
				name: data.name, 
				subtitle: data.subtitle, 
				brand: data.brand, 
				price:value.price, 
				description:contentsForm,
				images:data.images
			};
			apiRequest("PATCH", `/itens/edit-products/${props.products.id}`, { ...params })
			.then((res) => {
				setData(null);
				handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadProducts();
			})
			.catch((err) => {
				handleClose();
				props.setAlert(2);
				props.setSucess(2);
				props.getError(err)
			});
		}
	}

	const handleChangeData = (event) => {
		setData({
			...data,
			company_id: currentUser.companyProfiles[0].company_id,
			[event.target.name]: event.target.value,
		});
	};

	const handleChangeHtml = (content) => { 
		setContentsForm(content)
	}

	React.useEffect(() => {
		if(props.products.price) {
			setData({...data, 
				name: props.products.name,
				subtitle: props.products.subtitle,
				description: props.products.description,
				brand: props.products.brand,
				images: props.products.images,
			})
			setValue({...value, price: props.products.price})
		}
	},[props.products]);

	return (
		<div>
			<EditIcon 
				fontSize="medium" 
				style={{cursor:'pointer', color: 'black'}} 
				onClick={handleClickOpen}
			/>

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
							Cadastro de produto
						</Typography>
					</Toolbar>
				</AppBar>
				
				<DialogContent>
					<Grid container xs={12} sm={12} md={12}>
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
					<Grid container xs={12} sm={12} md={12} spacing={2}>
						<Grid item xs={12} sm={12} md={4}>
							<TextField
								fullWidth 
								variant="outlined" 
								name="name" 
								label="Nome do Produto"
								value={data ? data.name : ""}
								onChange={handleChangeData}
								error={error.name}
								helperText={error.name ? "Insira o nome do produto" : ""}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<InputField
								fullWidth
								mask="money"
								name="price"
								value={{...value}.price}
								label="Preço do Produto"
								onChange={
									e => setValue({...value, [e.target.name]: e.target.value})
								}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<TextField 
								fullWidth 
								variant="outlined" 
								name="subtitle" 
								type="text" 
								label="Subtítulo do Produto" 
								value={data ? data.subtitle : ""}
								onChange={handleChangeData}
								error={error.subtitle}
								InputLabelProps={{ shrink: true }}
								helperText={error.subtitle ? "insira o subtítulo do produto" : ""}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={4}>
							<TextField 
								fullWidth 
								variant="outlined" 
								name="brand" 
								type="text" 
								label="Marca do Produto" 
								value={data ? data.brand : ""}
								onChange={handleChangeData}
								error={error.brand}
								InputLabelProps={{ shrink: true }}
								helperText={error.brand ? "insira a marca do produto" : ""}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="h5"
								style={{ color: Colors.primary }}
							>
								Imagens
							</Typography>
							<div style={{display: 'flex', paddingTop: 10, flexDirection: 'row', alignItems: 'center'}}>
								{({...data}.images || []).map(image => {
									return <div 
										style={{width: 140, height: 140, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}
									>
										<img src={image} style={{width: 130, height: 130, objectFit: 'contain'}} />
										<div 
											onClick={() => setData(d => ({...d, images: d.images.filter(im => im !== image)}))} 
											style={{textAlign: 'center',background: '#CACACA', color: 'red', padding: 2, fontSize: 9, cursor: 'pointer'}}
										>Remover</div>
									</div>
								})}
								{loadFile && <div style={{width: 140, height: 140, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><CircularProgress /></div>}
								<div>
									<FileUploader
										label={"+ imagem JPEG/PNG"}
										onChange={onLoadFile}
										style={{width: 140, height: 140}}
									/>
									{loadFileError && <div style={{fontSize: 10, color: 'red'}}>{loadFileError}</div>}
								</div>
							</div>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<Typography 
								fullWidth
								variant="h5"
								style={{ color: Colors.primary }}
							>
								Descrição do Produto
							</Typography>
							<SunEditor
								setOptions={{
									height: 300,
									buttonList: [
										['undo', 'redo'],
										['font', 'fontSize', 'formatBlock'],
										['paragraphStyle', 'blockquote'],
										['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
										['fontColor', 'hiliteColor', 'textStyle'],
										['removeFormat'],
										['outdent', 'indent'],
										['align', 'horizontalRule', 'list', 'lineHeight'],
										['table', 'link', 'image', 'video'], // You must add the 'katex' library at options to use the 'math' plugin.
										// ['imageGallery'], // You must add the "imageGalleryUrl".
										['fullScreen', 'showBlocks', 'codeView'],
										// ['preview', 'print'],
										// ['save', 'template'],
										// '/', Line break
									]
								}}
								fullWidth
								variant="outlined" 
								name="description" 
								type="text" 
								label="Descrição do Produto" 
								//onChange={handleChangeData}
								onChange={(content) => handleChangeHtml(content)}
								error={error.description}
								InputLabelProps={{ shrink: true }}
								helperText={error.description ? "insira a descrição do produto" : ""}

								setContents={data ? data.description : ""}
								show={true}
								enable={true}
								showToolbar={true}
								enableToolbar={true}
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
									onClick={(e) => editProduct(e)} 

								>
									Inserir
								</Button>
							</Grid>
						</Grid>
					</DialogActions>
			</Dialog>
		</div>
	); 
}

