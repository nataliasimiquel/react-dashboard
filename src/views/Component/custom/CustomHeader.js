import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import logo from '../../assets/images/logo.png'
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { 
    ListItem, 
    Drawer,
    AppBar,
    Toolbar,
    List,
    Divider,
    IconButton,
    Snackbar,
    SnackbarContent,
    Typography,
    ListItemIcon,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Dialog,
    DialogContent,
    DialogTitle,
    Button,
    InputBase,
    DialogActions,
    Paper,
} from '@material-ui/core';
import CustomTheme from './CustomTheme';
import Auth from '../../util/Auth';
import { Colors } from '../../util/Util';

const drawerWidth = 200;
const appBarHeight = 60;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    textAlign: 'center',
    padding: 10,
  },
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    backgroundColor: '#000000',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    height: appBarHeight,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    left: 12,
    // marginRight: 20,
    position: 'absolute',
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    overflowY: 'auto',
    marginTop: appBarHeight + 3,
    height: `calc(100vh - ${appBarHeight+3}px)`,
    backgroundColor: '#f2f2f2',
    width: drawerWidth,
    border: 0,
  },
  drawerSpacing: {
    padding: '0',
    ...theme.mixins.toolbar,
  },
  drawerHeader: {
    backgroundColor: '#f2f2f2',
    color: '#FAFAFA',
    padding: '0 8px',
    // minHeight: '200px',
  },
  drawerHeaderBack: {
    display: 'flex',
    padding: '0 8px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  drawerHeaderUser: {
    padding: 10,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 20,
      '&:focus': {
        width: 200,
      },
    },
  },
  content: {
    flexGrow: 1,
    padding: `${appBarHeight + 10}px 50px 50px 50px`,
    backgroundColor: '#f9f9f9',
    height: `calc(100vh - ${(appBarHeight * 2) + 4}px)`,
    maxWidth: `calc(100% - ${theme.spacing.unit * 6}px)`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  'content-left': {
    marginLeft: -drawerWidth-1,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
    maxWidth: `calc(100% - ${drawerWidth}px)`,
  },
  'contentShift-right': {
    marginRight: 0,
    maxWidth: `calc(100% - ${drawerWidth}px)`,
  },
});

class PersistentDrawer extends React.Component {
  auth = Auth
  state = {
    open: true,
    anchor: 'left',
    expanded: false,
    searchingPerson: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  handleExpand = event => {
    this.setState({expanded: true})
  }

  render() {
    const { classes, theme, history } = this.props;
    const { anchor, open } = this.state;
    let current = this.auth.getUser().user

    const drawer = (
      <Drawer
        variant="persistent"
        anchor={anchor}
        open={open}
        classes={{paper: classes.drawerPaper,}}
      >
        <div className={classes.drawerHeader}>
          <div className={classes.drawerHeaderBack}>
            {/* <IconButton onClick={this.handleDrawerClose}>
              {
              theme.direction === 'rtl' 
              ? <ChevronRightIcon style={CustomTheme.palette.white} /> 
              : <ChevronLeftIcon style={CustomTheme.palette.white} />
              }
            </IconButton> */}
            &nbsp;
          </div>
          {/* <div style={{fontSize: 34, padding: 10, textAlign: 'center', color: 'black'}}>
            P<span style={{color: Colors.primary}}>A</span>SS
          </div> */}
          <Divider/>
          {
            current &&
            <ListItem className={classes.drawerHeaderUser}>
              <ListItemText                
                primary={<div style={{color: '#222'}}>
                  <div style={{fontSize: 13, lineHeight: 1, fontWeight: 'bold'}}>{current.name.split(" ")[0].toUpperCase()}</div>
                  <div style={{fontSize: 11, fontWeight: '500'}}>{current.name.split(" ")[1].toUpperCase()}</div>
                </div>}
              />
              <ListItemAvatar>
                <Avatar 
                  // style={{cursor: 'pointer'}} 
                  // onClick={event => {this.setState({expanded: !this.state.expanded})}} 
                  src={current.image && current.image.url}
                />
              </ListItemAvatar>
            </ListItem>
          }
          <div style={{padding: 20}}></div>
          <Divider/>
        </div>
        <div style={{flex: 1}}>
            <List>
              {  
                this.auth.getMenuItems().map((menuItem, i) => {
                  return [
                    !menuItem.url
                    ? <ListItem key={`${i}--1`} style={{padding: '0 10px', marginBottom: 10, marginTop: 10}}>
                      <ListItemText 
                        primary={
                          <div style={{ paddingBottom: 5, fontSize: 13, color: '#8A8A8A', }}>
                            {menuItem.title}
                          </div>
                        } 
                      />
                    </ListItem>
                    : <div style={{padding: '0 20px'}}>
                        <NavigatorButton 
                        key={`${i}--1`}
                        icon={menuItem.icon} 
                        url={menuItem.url} 
                        onClick={event => { this.props.onMenuClick && this.props.onMenuClick(menuItem) }}
                        style={{padding: '10px 10px 0', borderBottom: '2px solid #dadada'}}
                        styleLabel={{ paddingBottom: 5, fontSize: 13, fontWeight: '600', color: Colors.primary, }}
                      >
                        {menuItem.title}
                      </NavigatorButton>
                    </div>
                  ]
                })
              }
            </List>
        </div>
        <div>
          <NavigatorButton 
            url="#" 
            onClick={e => {this.auth.signout(() => window.location.href="/")}}
            style={{padding: '10px 10px 0', borderBottom: '2px solid #dadada'}}
            styleLabel={{ paddingBottom: 5, fontSize: 13, textAlign: 'center', fontWeight: '500', color: Colors.primary, }}
          >
            SAIR
          </NavigatorButton>
        </div>
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar
            className={classNames(classes.appBar)}
          >
            {/* <div style={{display: 'inline-flex', alignSelf: 'flex-end', fontSize: 20, padding: 20, textAlign: 'center', color: '#FAFAFA'}}>
              P<span style={{color: Colors.primary}}>A</span>SS
            </div> */}
            {/* <Toolbar disableGutters={!open}>
              {
                false &&
                <IconButton
                  // color="primary"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={classNames(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon style={CustomTheme.palette.white} />
                </IconButton>
              }
            </Toolbar> */}
          </AppBar>
          {before}
          <main
            style={{overflow: 'auto'}}
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            {/* <div className={classes.drawerSpacing} /> */}
            
            <div style={{position: 'relative'}}>
              {this.props.children}
            </div>
          </main>
          {after}
        </div>

        <Dialog
            open
            fullWidth
            style={{display: this.state.searchingPerson ? 'block' : 'none'}}
            onClose={event => { this.setState({searchingPerson: false}) }}
            maxWidth="sm"
        >
          {/* <DialogTitle>Buscar pessoa</DialogTitle> */}
          <DialogContent style={{paddingTop: 30,paddingBottom: 200}}>
            
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={event => { this.setState({searchingPerson: false}) }}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

class NavigatorButton extends React.Component {
  renderLink = props => <Link to={this.props.url} onClick={this.props.onClick} {...props} />;

  render() {
    const { icon, children, style, styleLabel } = this.props;
    return (
      <ListItem 
        button 
        component={this.renderLink} 
        style={style}
      >
        <ListItemText primary={
          <div style={{...styleLabel, whiteSpace: 'nowrap'}}>
            {icon && <img src={icon} style={{width: 22, height: 22, marginRight: 10, verticalAlign: 'middle'}} alt={"icon"} />}
            <span style={{verticalAlign: 'middle'}}>{children}</span>
          </div>
        } />
      </ListItem>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true, theme: CustomTheme })(PersistentDrawer);