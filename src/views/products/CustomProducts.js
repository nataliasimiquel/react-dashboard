import { AppBar, Button, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, Paper, Slide, TextField, Toolbar, Typography } from "@material-ui/core";
import CategoryRoundedIcon from '@material-ui/icons/CategoryRounded';
import CloseIcon from "@material-ui/icons/Close";
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import React from "react";
import SunEditor from 'suneditor-react';
import InputField from "../../commons/InputField";
import ClientContext from "../../contexts/ClientContext";
import { Colors, groupBy as groupByUtils, permutationBetweenGroups } from "../../util/Util";
import CardOptions from '../Component/CardOptions';
import FileUploader from '../Component/FileUploader/FileUploader';
import VariablesScreen from '../products/VariablesScreen';
import AuthContext from './../../contexts/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomProducts(props) {
	const {apiRequest} = React.useContext(ClientContext);
	const {currentUser} = React.useContext(AuthContext);

	const [data, setData] = React.useState({});
	const [value, setValue] = React.useState({});
	const [contentsForm, setContentsForm] = React.useState(null);
    
	const [dataVariables, setDataVariables] = React.useState({checked: []});
	const [allCombinations, setAllCombinations] = React.useState([]);

	const [loadFileError, setLoadFileError] = React.useState(null)
	const [loadFile, setLoadFile] = React.useState(false)
	const [loadingRemoveCustomization, setLoadingRemoveCustomization] = React.useState(false)
	const [customizationToRemoveId, setCustomizationToRemoveId] = React.useState(null)

	const [error, setError] = React.useState({ 
		name: false, 
		price: false, 
		subtitle: false, 
		description: false, 
		brand: false 
	});
    const [openVariable, setOpenVariable] = React.useState(false);

    let edit = (props.product && props.product.id)?true:false
	
    const handleOpenVariable = () => {setOpenVariable(true)}
	const handleCloseVariable = () => {setOpenVariable(false)}

    const handleChangeData = (event) => {
		if(event.target.name === "price") {
			setData({
				...data,
				price: parseFloat(event.target.value.replace(',','.'))
			})
		} else {
			setData({
				...data,
				[event.target.name]: event.target.value,
			});
		}	
	};
	
	const handleChangeHtml = (content) => { 
		setContentsForm(content)
	}

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

    const getInfoProduct = () => {
        apiRequest("GET", `/customproducts/info/${props.product.id}`)
        .then((res) => {
            setAllCombinations(res)
        })
        .catch((err) => {
        });
    }

    const getCombinations = () => {
        const groupedVariables = groupByUtils(dataVariables.checked, item => item.custom_category_id)
        const permuts = permutationBetweenGroups(groupedVariables.map(g => g[1].map(item => item.id)));
        const combinations = permuts.map(p => {
            const itemsPermuted = p.map(item => dataVariables.checked.find(c => c.id === item))
            return {
                attributes: itemsPermuted.map(ip => ip.id),
                title: itemsPermuted.map(ip => ip.title),
                simpleTitle: itemsPermuted.map(ip => ip.title).join(" - "),
            }
        });
        setAllCombinations(allCombinations.concat(combinations))
    }

    const registerVariables = (product) => {
        let params = {
            product_id: product.id,
            listCombinations: allCombinations,
            company_id: currentUser.companyProfiles[0].company_id,
        }

        apiRequest("POST", `/customproducts/` , { ...params })
        .then((res) => {
            props.handleClose();
            props.setAlert(1)
            props.setSucess(1)
            props.loadProducts();
        })
        .catch((err) => {
            props.handleClose();
            props.setAlert(2)
            props.setSucess(2)
            props.getError(err)
        });
    }

    const registerProduct = () => {
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
			let params = {
				name: data.name, 
				images: data.images,
				subtitle: data.subtitle, 
				brand: data.brand, 
				price:value.price, 
				description:contentsForm,
				company_id: currentUser.companyProfiles[0].company_id,
			};

			apiRequest("POST", "/itens/add-products ", { ...params })
			.then((product) => {
				props.handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadProducts();
                if(dataVariables.checked.length>0 
                && dataVariables.withVariables) {registerVariables(product)}
			})
			.catch((err) => {
				props.handleClose();
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
			});
		}
	}

    const editProduct = () => {
        const params = {
            name: data.name, 
            subtitle: data.subtitle, 
            brand: data.brand, 
            price:value.price, 
            description:contentsForm,
            images:data.images
        };

        apiRequest("PATCH", `/itens/edit-products/${props.product.id}`, { ...params })
        .then((res) => {
            props.handleClose();
            props.setAlert(1)
            props.setSucess(1)
            props.loadProducts();
            editVariables()
        })
        .catch((err) => {
            props.handleClose();
            props.setAlert(2);
            props.setSucess(2);
            props.getError(err)
        });
	}

    const editVariables = () => {
        let params = {
            product_id: props.product.id,
            listCombinations: allCombinations,
            company_id: currentUser.companyProfiles[0].company_id,
        }

        apiRequest("PATCH", `/customproducts/` , { ...params })
        .then((res) => {
            props.handleClose();
            props.setAlert(1)
            props.setSucess(1)
            props.loadProducts();
        })
        .catch((err) => {
            props.handleClose();
            props.setAlert(2)
            props.setSucess(2)
            props.getError(err)
        });
    }
    const removeProductCustomization = (customization) => {
        setCustomizationToRemoveId(customization.id)
        setLoadingRemoveCustomization(true);
        apiRequest("PATCH", `/customproducts/remove/product/customization` , { ...customization })
        .then((res) => {
            setLoadingRemoveCustomization(false);
            setCustomizationToRemoveId(null)
            getInfoProduct();
        })
        .catch((err) => {
            setLoadingRemoveCustomization(false);
            setCustomizationToRemoveId(null)
            getInfoProduct();
        });
    }

	React.useEffect(() => {
        //toda vez q abre e fecha o modal é limpado os valores
		setData({})
		setValue({})
		setContentsForm({})
        setAllCombinations([])
        setDataVariables({checked: []})

        //caso exista dados já criados já iram ser setados
        if(edit && props.open) {getInfoProduct()}
		if(edit && props.product) {
            setData({
                ...data, 
                name: props.product.name,
                subtitle: props.product.subtitle,
                description: props.product.description,
                brand: props.product.brand,
                images: props.product.images,
            });
            setValue({...value, price: props.product.price});
        }
	},[props.open]);

    /* React.useEffect(() => {
        setTimeout(() => {getCombinations()}, 2500);
	},[dataVariables]); */

	return (
		<div>
			<Button 
				fullWidth
				variant="contained" 
				color="primary" 
				style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
				onClick={() => {
                    props.handleOpen()
                    props.setData(sd => ({...sd, currentProduct: {}}))
                }}
			>
				{"Novo Produto"}
			</Button>
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
							style={{
                                flex: 1,
                                fontSize: 22,
                                marginLeft: "3%", 
                                fontWeight: "bold",
                            }}
						>
            				{edit?"Editar o produto":"Adicionar um produto"}
						</Typography>
					</Toolbar>
				</AppBar>
				<DialogContent>
                    <div 
                        style={{
                            margin: 10,
                        }}
                    >
                        <div 
                            style={{
                                margin:"2%", 
                                marginTop:15,
                                marginBottom:15, 
                            }}
                        >
                            <Grid 
                                container 
                                direction="row"
                            >
                                <Grid 
                                    item
                                    //style={{marginTop:30}} 
                                    xs={12} sm={12} md={12}
                                >
                                    <Typography 
                                        variant="h5"
                                        style={{ 
                                            marginTop: 10,
                                            marginLeft: 10,
                                            marginBottom: 10,
                                            fontWeight: "bolder",
                                            color: Colors.primary,
                                        }}
                                    >
                                        Nome do Produto
                                    </Typography>
                                    <TextField
                                        fullWidth 
                                        name="name" 
                                        label="Nome"
                                        error={error.name}
                                        variant="outlined" 
                                        onChange={handleChangeData}
                                        value={data ? data.name : ""}
                                        InputLabelProps={{ shrink: true }}
                                        helperText={error.name ? "Insira o nome do produto" : ""}
                                    />
                                </Grid>
                                <Grid 
                                    item 
                                    xs={12} sm={12} md={4}
                                >
                                    <Typography 
                                        variant="h5"
                                        style={{ 
                                            marginTop: 20,
                                            marginLeft: 10,
                                            marginBottom: 10,
                                            fontWeight: "bolder",
                                            color: Colors.primary,
                                        }}
                                    >
                                        Imagem do Produto
                                    </Typography>
                                    <div 
                                        style={{
                                            marginLeft:25,
                                            paddingTop: 10, 
                                            display: 'flex', 
                                            flexDirection: 'row', 
                                            alignItems: 'center'
                                        }}
                                    >
                                        {({...data}.images || []).map(image => {
                                            return <div 
                                                style={{
                                                    width: 140, 
                                                    height: 140, 
                                                    display: 'flex', 
                                                    cursor: 'pointer', 
                                                    alignItems: 'center', 
                                                    flexDirection: 'column', 
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <img 
                                                    src={image} 
                                                    style={{
                                                        width: 130,
                                                        height: 130, 
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                                <div 
                                                    onClick={
                                                        () => setData(d => ({
                                                            ...d, 
                                                            images: d.images.filter(im => im !== image
                                                        )})
                                                    )} 
                                                    style={{
                                                        padding: 2,
                                                        fontSize: 9,
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        background: '#CACACA',
                                                    }}
                                                >Remover</div>
                                            </div>
                                        })}
                                        {loadFile && <div 
                                            style={{
                                                width: 140, 
                                                height: 140, 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <CircularProgress />
                                        </div>}
                                        <div>
                                            <FileUploader
                                                onChange={onLoadFile}
                                                label={"+ imagem JPEG/PNG"}
                                                style={{width: 140, height: 140}}
                                            />
                                            {loadFileError && <div style={{fontSize: 10, color: 'red'}}>{loadFileError}</div>}
                                        </div>
                                    </div>
                                </Grid>
                                <Grid
                                    item 
                                    style={{marginBottom:15}}
                                    xs={12} sm={12} md={8}
                                >
                                    <Typography 
                                        fullWidth
                                        variant="h5"
                                        style={{ 
                                            marginTop: 20,
                                            marginLeft: 10,
                                            marginBottom: 5,
                                            fontWeight: "bolder",
                                            color: Colors.primary,
                                        }}
                                    >
                                        Descrição do Produto
                                    </Typography>
                                    <SunEditor
                                        setOptions={{
                                            height: 85,
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
                                        fullWidth
                                        variant="outlined" 
                                        name="description" 
                                        type="text" 
                                        label="Descrição do Produto" 
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
                                <Grid 
                                    item
                                    style={{marginTop: 25}}
                                    xs={12} sm={12} md={12}
                                >
                                    <Typography 
                                        fullWidth
                                        variant="h5"
                                        style={{ 
                                            marginLeft: 10,
                                            marginBottom: 5,
                                            fontWeight: "bolder",
                                            color: Colors.primary,
                                        }}
                                    >
                                        Mais informações
                                    </Typography>
                                    <Paper 
                                        elevation="2"
                                        style={{
                                            margin: 5,
                                            padding: "20px 20px 20px 20px",
                                        }}
                                    >
                                        <Grid 
                                            container 
                                            spacing={2} 
                                            alignItems="flex-end"
                                        >
                                            <Grid item xs={12} sm={12} md={4}>
                                                <InputField
                                                    fullWidth
                                                    mask="money"
                                                    name="price"
                                                    error={error.price}
                                                    value={{...value}.price}
                                                    label="Preço do Produto"
                                                    helperText={error.price ? "Insira um valor" : ""}
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
                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid 
                                    item
                                    style={{marginTop: 25}}
                                    xs={12} sm={12} md={12}
                                >
                                    <Typography 
                                        variant="h5"
                                        style={{ 
                                            marginLeft: 10,
                                            marginBottom: 5,
                                            fontWeight: "bolder",
                                            color: Colors.primary,
                                        }}
                                    >
                                        Opções avançadas
                                    </Typography>
                                    <CardOptions
                                        title={"Customizações"}
                                        button={"Adicionar variações"}
                                        body={"Adicione aqui as variáveis do produto"}
                                        onClick={() => {handleOpenVariable()}}
                                        icon={<VerticalSplitIcon
                                            style={{
                                                fontSize: 70, 
                                                color: Colors.primary
                                            }}
                                        />}
                                        titleList={"Variações do produto:"}
                                        setData={setAllCombinations}
                                        data={allCombinations}
                                        removeProductCustomization={removeProductCustomization}
                                        loadingRemoveCustomization={loadingRemoveCustomization}
                                        customizationToRemoveId={customizationToRemoveId}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                    </div>
                </DialogContent>
				<DialogActions>
					<Grid container direction="row" xs={12} sm={12} md={12} spacing={1}>
						<Grid item xs={12} sm={12} md={3}>
							<Button 
								fullWidth
								color="primary" 
								variant="contained"
								style={{borderRadius: 8}}
								onClick={props.handleClose}
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
                                    (edit)
                                    ?() => editProduct()
                                    :() => registerProduct()
                                } 
							>
                				{edit?"Salvar":"Inserir"}
							</Button>
						</Grid>
					</Grid>
				</DialogActions>
			</Dialog>

            <VariablesScreen
                open={openVariable}
                Transition={Transition}
                handleClose={handleCloseVariable}

                data={dataVariables}
                setData={setDataVariables}
                getCombinations={getCombinations}
            />
		</div>
	);
}
