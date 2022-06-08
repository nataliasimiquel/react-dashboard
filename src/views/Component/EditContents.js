import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ClientContext from "../../contexts/ClientContext";
import FileUploader from "./FileUploader/FileUploader";


export default function EditProduct(props) {
const {apiRequest} = React.useContext(ClientContext);

const [open, setOpen] = React.useState(false);
const [contentInfo, setContentInfo] = React.useState([])

const [dataForm, setDataForm] = React.useState([]);
const [contentsForm, setContentsForm] = React.useState([]);
const [dataImage, setDataImage] = React.useState([]);
const [dataPdf, setDataPdf] = React.useState([]);
const [pass, setPass] = React.useState(false);

const [loadingPost, setLoadingPost] = React.useState(false);
const [errorPost, setErrorPost] = React.useState(null);
const [errorLoadFile, setErrorLoadFile] = React.useState(false);
const [loadFile, setLoadFile] = React.useState(false);
const [loadFileError, setLoadFileError] = React.useState(false);

var attributesList = props.contentsAttributes//contentInfo.attributes?contentInfo.attributes:[]
	
const handleClickOpen = () => { setOpen(true) }

const handleClose = () => { 
	setOpen(false)
	setDataForm([])
	setContentsForm([])
	setDataImage([])
	setDataPdf([])
	setContentInfo([]) 
};

const loadContentInfo = (contentId) => {
	apiRequest("GET", `/contents/${contentId}/info`)
	.then((res) => {
		setContentInfo(res)
		setPass(true)
	})
	.catch((err) => {
		console.log("nao conseguiu carregar as informações do conteudo", err);
	});
}

const setInfo = () => {
	let attributesList = contentInfo.attributes?contentInfo.attributes:[]
	
	attributesList.map(item => {
		if(item.contentAttribute.type === "string") {
			let index = dataForm.indexOf({value: item.value_attribute, caId: item.contentAttribute.id})
			if (index === -1) dataForm.push({value: item.value_attribute, caId: item.contentAttribute.id})
			//setPass({value: "teste", caId: null}) 
		}

		if(item.contentAttribute.type === "html") { 
			let index = contentsForm.indexOf({value: item.value_attribute, caId: item.contentAttribute.id})
			contentsForm.push({value: item.value_attribute, caId: item.contentAttribute.id}) 
		}

		if(item.contentAttribute.type === "image") { 
			if(item.value_attribute.slice(-3) === "pdf") {
				let index = dataPdf.indexOf({value: item.value_attribute, caId: item.contentAttribute.id}) 
				dataPdf.push({value: item.value_attribute, caId: item.contentAttribute.id}) } 
			else { 
				let index = dataImage.indexOf({value: item.value_attribute, caId: item.contentAttribute.id})
				if (index === -1) dataImage.push({value: item.value_attribute, caId: item.contentAttribute.id}) }
		 }

	})
	setPass(false)

}

const editContent = (contentId) => {
	let submitAttributes = []

	for (let k in contentsForm) { submitAttributes.push(contentsForm[k]) }
	for (let k in dataImage) { submitAttributes.push(dataImage[k]) }
	for (let k in dataForm) { submitAttributes.push(dataForm[k]) }
	for (let k in dataPdf) { submitAttributes.push(dataPdf[k]) }

	let listFiltered = submitAttributes.reduce((old, item) => {
		if(old.find(i => i.caId === item.caId)) return [...old]
		return [...old,item]
	},[])
	
	apiRequest("PATCH", `/contents/edit-post/${contentId}`, {
		content_type_id: props.contentTypeId, 
		attributes: listFiltered,
	})
	.then((res) => {
		setOpen(false)
		setDataForm([])
		setContentsForm([])
		setDataImage([])
		setDataPdf([])
		props.refresh();
	})
	.catch((err) => {
			console.log("nao conseguiu editar o conteudo", err);
	});
}

const onLoadFile = (params) => {
		//setLoadFile(true)
		setErrorLoadFile(null)

		let formData = new FormData();
		formData.append("File", params.e)

		apiRequest("POST", `/contents/file/admin-contents`, formData)
		.then(res => { if(res.file) {
				if(res.file.slice(-3) === "pdf") { setDataPdf({...dataPdf, value: res.file, caId: params.ca}) } 
				else { 
					let caId = params.ca
					let newDataForm = [...dataImage].filter(item => item.caId !== caId)
					let previousValue = {...dataImage.find(item => item.caId === caId), caId}
					previousValue.value = res.file
					setDataImage([...newDataForm, previousValue])

					//setDataImage({...dataImage, value: res.file, caId: params.ca}) 
				}

				setLoadFile(false)

		} else {
				setLoadFileError({error: "Falha ao subir arquivo"})
				setLoadFile(false)
		}
		})
		.catch((err) => {
		console.log("caiu no catch no onLoadFile", err)
		setLoadFileError(err)
		setLoadFile(false)
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

React.useEffect(() => {
	if (open) { loadContentInfo(props.contentId) }
}, [open])

React.useEffect(() => {
	if (pass) { setInfo() }
}, [pass])

/* React.useEffect(() => {
	console.log("dataForm", [...dataForm, ...contentsForm, dataImage, dataPdf])
}, [dataForm, contentsForm, dataImage, dataPdf]) */

const body = (
<div>
		<Grid container direction="column" justifyContent="flex-start" alignItems="center" spacing={4}>
		{
			 attributesList.map(ca => {
				const item = dataForm.length>0?dataForm.find(i => i.caId === ca.id):dataForm
				const itemHtml = contentsForm.length>0?contentsForm.find(i => i.caId === ca.id):contentsForm
				const itemImage = dataImage.length>0?dataImage.find(i => i.caId === ca.id):dataImage
				const itemPdf = dataPdf.length>0?dataPdf.find(i => i.caId === ca.id):dataPdf

				return (ca.type === "html")
					? <Grid key={`${ca.id}`} item xs={12} md={12} style={{marginBottom:15}}>
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
									['fullScreen', 'showBlocks', 'codeView'],
								]
							}}
							onChange={(content) => handleChangeHtml(content, ca.id)}
							setContents={itemHtml ? itemHtml.value : null} 
							show={true}
							enable={true}
							showToolbar={true}
							enableToolbar={true}
						/>
					</Grid>
					: (ca.type === "image")
						? <Grid>
								{
									(loadFile === true)
									? "carregando"
									: <FileUploader
											label={"+ imagem JPEG/PNG"}
											value={itemImage ? itemImage.value : ""}
											fileSrc={itemImage ? itemImage.value : ""}
											onChange={(e)=> onLoadFile({e, ca:ca.id})}
										/> 
								}
								{
									errorLoadFile && <span style={{color: 'red'}}>{errorLoadFile}</span>
								}
							</Grid>
							
						: (ca.type === "pdf")
						? <Grid style={{marginTop: 10}}>
							{
								(loadFile === true)
								? "carregando"
								: <FileUploader
										label={"+ arquivo em PDF"}
										value={itemPdf ? itemPdf.value : ""}
										fileSrc={itemPdf ? itemPdf.value : ""}
										onChange={(e)=> onLoadFile({e, ca:ca.id})}
									/> 
							}
							{
								errorLoadFile && <span style={{color: 'red'}}>{errorLoadFile}</span>
							}
						</Grid>
						: <Grid key={`${ca.id}`} item xs={12} md={3} style={{ marginBottom:14 }}>
							<TextField
								fullWidth
								variant="outlined"
								InputLabelProps={{shrink: true}}
								name={ca.title?ca.title.replaceAll(" ", "-"):""}
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
		<Tooltip title="Editar">
			<IconButton onClick={() => {
				handleClickOpen()
			}}>
				<EditIcon 
					fontSize="medium" 
					style={{cursor:'pointer', color: 'black'}} 
				/> 
			</IconButton>
		</Tooltip>

		<Dialog 
			fullScreen
			open={open} 
			onClose={() => handleClose()} 
		>

			<DialogTitle> <CloseIcon onClick={() => handleClose()} /> Editar</DialogTitle>

				<DialogContent>
				{body}
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
							onClick={() => editContent(props.contentId)}
						>
							Salvar alterações
						</Button>
					</Grid>
				</Grid>
			</DialogActions>
		</Dialog>
	</div>); 
}

