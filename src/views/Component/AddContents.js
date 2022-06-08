import {
	Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
	Grid, TextField, Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import FileUploader from "./FileUploader/FileUploader";

export default function AddContents(props) {
const { apiRequest } = React.useContext(ClientContext);

const [dataForm, setDataForm] = React.useState([]);
const [contentsForm, setContentsForm] = React.useState([]);
const [dataImage, setDataImage] = React.useState([]);
const [dataPdf, setDataPdf] = React.useState([]);

const [loadingPost, setLoadingPost] = React.useState(false);
const [errorPost, setErrorPost] = React.useState(null);

//estados sobre files
const [errorLoadFile, setErrorLoadFile] = React.useState({});
const [loadFile, setLoadFile] = React.useState({});
				
const postContent = () => {
	setLoadingPost(true)
	setErrorPost(null)

	let submitAttributes = []

	for (let k in contentsForm) { submitAttributes.push(contentsForm[k]) }
	for (let k in dataImage) { submitAttributes.push(dataImage[k]) }
	for (let k in dataForm) { submitAttributes.push(dataForm[k]) }
	for (let k in dataPdf) { submitAttributes.push(dataPdf[k]) }

	apiRequest("POST", "/contents/content", {
		content_type_id: props.contentTypeId, 
		attributes: submitAttributes,
	})
	.then((res) => {
		props.refresh();
		props.onClose();
		setDataForm([])
		setContentsForm([])
		setDataImage([])
		setDataPdf([])
		setLoadingPost(false)
	})
	.catch((err) => {
		setErrorPost(err.message)
		setLoadingPost(false)
		console.log("caiu no catch no postContent", err)
	});
	
}

const handleChangeHtml = (content, caId) => { 
	let newDataForm = [...contentsForm].filter(item => item.caId !== caId)
	let previousValue = {...contentsForm.find(item => item.caId === caId), caId}
	previousValue.value = content
	setContentsForm([...newDataForm, previousValue])
}

const handleChange = (e, caId) => { 
	let newDataForm = [...dataForm].filter(item => item.caId !== caId)
	let previousValue = {...dataForm.find(item => item.caId === caId), caId}
	previousValue.value = e.target.value
	setDataForm([...newDataForm, previousValue])
}

const onLoadFile = (params) => {
	const caId = params.ca
	setLoadFile(lf => ({...lf, [`${caId}`]: true}))
	setErrorLoadFile(elf => ({...elf, [`${caId}`]: null}))

	let formData = new FormData();
	formData.append("File", params.e)

	apiRequest("POST", `/contents/file/admin-contents`, formData)
	.then(res => { if(res.file) {
			if(res.file.slice(-3) === "pdf") { dataPdf.push({value: res.file, caId: params.ca}) } 
			else {
				dataImage.push({value: res.file, caId: params.ca}) }

			setLoadFile(false)

		} else {
			setErrorLoadFile(elf => ({...elf, [`${caId}`]: "Falha ao subir arquivo"}))
			setLoadFile(lf => ({...lf, [`${caId}`]: false}))
		}
	})
	.catch((err) => {
		console.log("caiu no catch no onLoadFile", err)
		setErrorLoadFile(elf => ({...elf, [`${caId}`]: err.message}))
		setLoadFile(lf => ({...lf, [`${caId}`]: false}))
	});
}

const body = (
	<div>
		<Grid 
			container 
			spacing={1}
			direction="column" 
			alignItems="center" 
			justifyContent="flex-start" 
		>
			{
				props.contentsAttributes.map((ca, index) => {
					const item = dataForm.find(i => i.caId === ca.id)

					return (ca.type === "html")
					? <Grid key={`${ca.id}`} item xs={12} md={12}>
						<Typography 
							color="primary" 
							style={{
								fontSize:18,
								marginBottom: 10,
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							{ca.title}
						</Typography>
						<SunEditor
							setOptions={{
								height: 400,
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
							onChange={(content) => handleChangeHtml(content, ca.id)}
							setContents={item ? item.value : null} 
							show={true}
							enable={true}
							showToolbar={true}
							enableToolbar={true}
						/>
					</Grid>
					: ["image", "pdf"].includes(ca.type)
						? <Grid key={`${ca.id}`} item xs={12} md={3}>
								<Typography 
									color="primary" 
									style={{
										fontSize:18,
										marginBottom: 10,
										fontWeight: "bold",
										textAlign: "center",
									}}
								>
									{ca.title}
								</Typography>
								<FileUploader
									label={loadFile[`${ca.id}`] ? "carregando" : ca.type === "pdf" ? "+ arquivo em PDF" : "+ imagem JPEG/PNG"}
									value={item ? item.value : ""}
									fileSrc={item ? item.value : ""}
									onChange={(e)=> onLoadFile({e, ca:ca.id})}
								/> 
								{item && item.value && <a href={item.value} target="_blank">Visualizar arquivo</a>}
								{errorLoadFile[`${ca.id}`] && <span style={{color: 'red'}}>{errorLoadFile[`${ca.id}`]}</span>}
							</Grid>
						: (ca.type === "pdf")
						? <Grid style={{marginTop: 10}}>
							{
								(loadFile === true)
								? "carregando"
								: <Grid key={`${ca.id}`} item xs={12} md={3}> 
									<Typography 
										color="primary" 
										style={{
											fontSize:18,
											marginBottom: 10,
											fontWeight: "bold",
											textAlign: "center",
										}}
									>
										{ca.title}
									</Typography>
									<FileUploader
										label={"+ arquivo em PDF"}
										value={dataPdf ? dataPdf.value : ""}
										fileSrc={dataPdf ? dataPdf.value : ""}
										onChange={(e)=> onLoadFile({e, ca:ca.id})}
									/> 
								</Grid>
							}
							{
								errorLoadFile && <span style={{color: 'red'}}>{errorLoadFile}</span>
							}
						</Grid>
						: <Grid key={`ca.id}`} item xs={12} md={3} style={{ marginBottom:14 }}>
							<TextField
								fullWidth
								variant="outlined"
								InputLabelProps={{shrink: true}}
								name={ca.title.replaceAll(" ", "-")}
								label={ca.title}
								value={item ? item.value : null}
								type={{
									"date": "date",
									"number": "number"
								}[ca.type] || "text"}
								multiline={ca.type === "text"}
								minRows={ca.type === "text" ? 5 : 1}
								onChange={(e) => handleChange(e, ca.id)}
							/>
						</Grid>
				})
			}
		</Grid>
	</div>
);

return (
	<div>
		<Grid container direction="row" justify="center" alignItems="center" spacing={1}>
			
		</Grid>
		
		<Dialog 
			fullScreen
			open={props.open} 
			onClose={props.onClose} 
		>
			<DialogTitle><CloseIcon onClick={props.onClose} /> Adicionar</DialogTitle>
			<DialogContent>
				{body}

				{errorPost && <div style={{color: 'red', padding: 10, fontSize: 12, textAlign: 'right'}}>{errorPost}</div>}
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
							disabled={loadingPost}
							onClick={postContent}
						>
							{loadingPost ? <CircularProgress size={22} /> : 'ADICIONAR'}
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Dialog>
	</div>
	);
}
