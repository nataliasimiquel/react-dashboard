import { Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, List, ListItem, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from './../../contexts/AuthContext';
import AddIcon from '@material-ui/icons/Add';


export default function VariablesScreen(props) {
    const {apiRequest} = React.useContext(ClientContext);
	const {currentUser} = React.useContext(AuthContext);
    
	const [attributes, setAttributes] = React.useState([]);

	const [newCategory, setNewCategory] = React.useState('');
	const [newAttribute, setNewAttribute] = React.useState('');

    var listFiltered = props.data && props.data.name?attributes.filter(item => item.name === props.data.name):[]

    const getAttributes = (value) => {
        apiRequest("GET", `/customproducts/all-attributes/${currentUser.companyProfiles[0].company_id}`)
        .then((res) => {
            setAttributes(res)
        })
        .catch((err) => {
            console.log("nao conseguiu apagar o produto", err);
        });
    }

    const createCustomCategory = () => {
        let params = {
            name: newCategory,
            company_id: currentUser.companyProfiles[0].company_id,
        }

        apiRequest("POST", "/customproducts/new-custom-category/", params)
        .then((res) => {
            setNewCategory('')
            getAttributes()
            props.setData(sd => ({...sd, name: props.data.current_category})) 
        })
        .catch((err) => {
            console.log("erro dentro de createCustomCategory", err);
        }); 
    }

    const createCustomAttribute = () => {
        let params = {
            title: newAttribute,
            custom_category_id: props.data.custom_category_id
        }

        apiRequest("POST", "/customproducts/new-custom-attribute/", params)
        .then((res) => {
            setNewAttribute('')
            getAttributes()
            props.setData(sd => ({...sd, name: props.data.current_category})) 
        })
        .catch((err) => {
            console.log("erro dentro de createCustomCategory", err);
        }); 
    }

    const handleToggle = (value) => () => {
        const currentIndex = props.data && props.data.checked.some(item => item.id === value.id);
        let newChecked = [...props.data && props.data.checked];
    
        if (currentIndex === false) { newChecked.push(value); } 
        else { newChecked = newChecked.filter(item => item.id !== value.id); }
    
        props.setData(sd => ({ ...sd,  checked: newChecked }));
    };

    React.useEffect(() => {
        if(props.open) {getAttributes()}
	},[props.open]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <Dialog
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={props.Transition}
    >
        <DialogTitle>
            <Typography 
                variant="h5"
                style={{ 
                    marginTop: 10,
                    marginLeft: 10,
                    fontWeight: "bolder",
                }}
            >
                Adicionar variáveis
            </Typography>
        </DialogTitle>
        <DialogContent>
            <div 
                style={{
                    marginLeft:5, 
                    marginRigth:5, 
                    marginBottom:5
                }}
            >
                <Typography 
                    variant="subtitle1"
                >
                    Selecione as opções do produto nas sugestões dadas aos valores de propriedade ou escreva o nome da sua variável
                </Typography> 
            </div>
            <div style={{margin:5, marginBottom:25}}>
                <Typography 
                    variant="body"
                    style={{
                        color:"gray"
                    }}
                >
                    Você pode combinar com até 2 propriedades
                </Typography> 
            </div>
            <Divider/>
            <div 
                style={{
                    marginTop:30,
                    marginBottom:15, 
                }}
            >
                <Typography 
                    variant="h6"
                    style={{ 
                        marginLeft: 10,
                        fontWeight: "bolder",
                    }}
                >
                    Propriedades
                </Typography>
                <FormControl
                    fullWidth
                    variant="outlined"
                    style={{width:"57%"}}
                >
                    <Select fullWidth>
                        {attributes.map((att) => (
                            <MenuItem
                                key={att.id}
                                value={att}
                                onClick={() => { 
                                    props.setData(sd => ({
                                        ...sd, 
                                        name:att.name, 
                                        current_category: att.name, 
                                        custom_category_id: att.id,
                                    })) 
                                }}
                            >
                                {att.name}
                            </MenuItem>
                        ))}
                        <MenuItem
                            value={"newProp"}
                            onClick={() => { props.setData(sd => ({...sd, name:"newProp"})) }}
                        >
                            {"Outra propriedade"}
                        </MenuItem>
                    </Select>
                </FormControl>
                {
                    props.data.name == "newProp"
                    ? <Grid 
                        container
                        spacing={1}
                        direction="row"
                        alignItems="flex-end"
                        style={{marginTop: 10, marginBottom:10}}
                    >
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography 
                                variant="body"
                                style={{
                                    marginTop: 10, 
                                    marginLeft: 10,
                                }}
                            >
                                Nova propriedade
                            </Typography> 
                        </Grid>
                        <Grid item xs={12} sm={12} md={7}>
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                value={newCategory}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                				style={{ padding: '15px 0px 15px 0px', borderRadius:8 }}
                                onClick={() => { 
                                    props.setData(sd => ({...sd, name:""})) 
                                    createCustomCategory()
                                }}
                            >
                                Adicionar
                            </Button>
                        </Grid>

                    </Grid>
                    : <div></div>
                }
            </div>
            <div 
                style={{
                    marginTop:30,
                    marginBottom:25, 
                }}
            >
                <Typography 
                    variant="h6"
                    style={{ 
                        marginTop: 10,
                        marginLeft: 10,
                        fontWeight: "bolder",
                    }}
                >
                    Variáveis selecionadas:
                </Typography>
                <Card 
                    variant="outlined"
                    style={{
                        margin: 5,
                        borderRadius: 10,
                        padding: "20px 20px 20px 20px",
                    }}
                >
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                    >
                        {
                            props.data && 
                            props.data.checked &&
                            props.data.checked.map((item, index) => { return (
                                <Grid 
                                    item
                                    xs={6} sm={6} md={4}
                                >
                                    <Card 
                                        variant="elevation"
                                        style={{
                                            borderRadius: 15,
                                            backgroundColor: "#eeeeee",
                                            padding: "5px 5px 5px 5px",
                                        }}
                                    >
                                        <Grid 
                                            container
                                            spacing={1}
                                            direction="row"
                                        >
                                            <Grid item>
                                                <CloseIcon
                                                    onClick={handleToggle(item)}
                                                    style={{
                                                        fontSize:20,
                                                        color: "#515A5A", 
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                {item.title}
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                                )
                            }) 
                        }
                    </Grid>
                </Card>
                <Typography 
                    variant="body"
                    style={{
                        color:"gray",
                        marginLeft: 10,
                    }}
                >
                    Caso não encontrou a variável que precisa, você pode criar
                </Typography> 
            </div>
            <div 
                style={{
                    marginTop:15,
                    marginBottom:15, 
                }}
            >
                <Typography 
                    variant="h6"
                    style={{ 
                        marginTop: 10,
                        marginLeft: 10,
                        fontWeight: "bolder",
                    }}
                >
                    Opções:
                </Typography>
                {
                    (listFiltered.length === 0) 
                    ? <Typography 
                        variant="body"
                        style={{
                            color:"gray",
                            marginLeft: 10,
                            marginBottom: 20, 
                        }}
                    >
                        Selecione alguma propriedade
                    </Typography> 
                    : listFiltered.map((itemMap, indexMap) => { return(
                        <Grid
                            container
                            spacing={1}
                            direction="row"
                        >
                            <Grid 
                                item
                                xs={12} sm={12} md={12}
                            >
                                <List>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                    >
                                        {
                                            itemMap.custom_attributes.map((att, indexAtt) => {return(
                                                <Grid 
                                                    item
                                                    sm={6} md={3}
                                                >
                                                    <Card>
                                                        <ListItem 
                                                            dense 
                                                            button 
                                                            key={att.id}
                                                            onClick={handleToggle(att)}
                                                        >
                                                            <Checkbox
                                                                edge="start"
                                                                tabIndex={-1}
                                                                disableRipple
                                                                color="primary"
                                                                checked={
                                                                    props.data && 
                                                                    props.data.checked && 
                                                                    props.data.checked.some(item => item.id === att.id)
                                                                }
                                                            />
                                                            {att.title}
                                                        </ListItem>
                                                    </Card>
                                                </Grid>
                                                )
                                            })
                                        }
                                        <Grid 
                                            item
                                            sm={6} md={3}
                                        >
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => { props.setData(sd => ({...sd, name:"newVar"})) }}
                                                style={{
                                                    borderRadius: 8, 
                                                    backGroundColor: "#5F5F5F",
                                                    padding: '8px 0px 8px 0px',
                                                }}
                                            >
                                                <AddIcon 
                                                    fontSize="medium"
                                                    style={{color:"#555555"}}
                                                />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </List>
                            </Grid>
                        </Grid>
                    )
                    })
                }
                {
                    props.data.name === "newVar"
                    ? <Grid 
                        container
                        spacing={1}
                        direction="row"
                        alignItems="flex-end"
                        style={{marginTop: 10, marginBottom:10}}
                    >
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography 
                                variant="body"
                                style={{
                                    marginTop: 10, 
                                    marginLeft: 10,
                                }}
                            >
                                Nova variável
                            </Typography> 
                        </Grid>
                        <Grid item xs={12} sm={12} md={7}>
                            <TextField 
                                fullWidth 
                                variant="outlined" 
                                value={newAttribute}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => setNewAttribute(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={5}>
                            <Button
                                fullWidth
                                color="primary"
                                variant="contained"
                                style={{ padding: '15px 0px 15px 0px', borderRadius:8 }}
                                onClick={() => { 
                                    props.setData(sd => ({...sd, name:""})) 
                                    createCustomAttribute()
                                }}
                            >
                                Adicionar
                            </Button>
                        </Grid>

                    </Grid>
                    : <div></div>
                }
            </div>
        </DialogContent>
        <DialogActions>
            <Grid 
                container 
                spacing={1}
                direction="row" 
                xs={12} sm={12} md={12} 
            >
                <Grid item xs={12} sm={12} md={9}></Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Button
                        fullWidth
                        color="primary" 
                        variant="contained"
                        style={{borderRadius: 8}}
                        onClick={() => {
                            props.setData(sd => ({
                                ...sd,
                                withVariables: true
                            }));
                            props.handleClose();
                            props.getCombinations();
                        }} 
                    >
                        Salvar
                    </Button>
                </Grid>
            </Grid>
        </DialogActions>
    </Dialog>
    )
}