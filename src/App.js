import { createTheme, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ThemeProvider } from '@material-ui/styles';
import EventEmitter from 'eventemitter3';
import moment from 'moment';
import React from 'react';
import './App.scss';
//import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Colors } from "../src/util/Util";
import AppContext from './contexts/AppContext';
import AuthContext from './contexts/AuthContext';
import ClientContext from './contexts/ClientContext';
import serverRequest, { getSocket } from './service/RestClient';
import PrivateRoute from './util/PrivateRoute';


const keyPressEvents = [
  {tag: 'TAB', keyCode: 9, ctrlKey: false, shiftKey: false},
  {tag: 'ESC', keyCode: 27, ctrlKey: false, shiftKey: false},
  {tag: 'F1', keyCode: 112, ctrlKey: false, shiftKey: false},
  {tag: 'F2', keyCode: 113, ctrlKey: false, shiftKey: false},
  {tag: 'F3', keyCode: 114, ctrlKey: false, shiftKey: false},
  {tag: 'F4', keyCode: 115, ctrlKey: false, shiftKey: false},
  {tag: 'F5', keyCode: 116, ctrlKey: false, shiftKey: false},
  {tag: 'F6', keyCode: 117, ctrlKey: false, shiftKey: false},
  {tag: 'F7', keyCode: 118, ctrlKey: false, shiftKey: false},
  {tag: 'F8', keyCode: 119, ctrlKey: false, shiftKey: false},
  {tag: 'F9', keyCode: 120, ctrlKey: false, shiftKey: false},
  {tag: 'F10', keyCode: 121, ctrlKey: false, shiftKey: false},
  {tag: 'F11', keyCode: 122, ctrlKey: false, shiftKey: false},
  {tag: 'F12', keyCode: 123, ctrlKey: false, shiftKey: false},
  {tag: 'Left', keyCode: 37, ctrlKey: false, shiftKey: false},
  {tag: 'Right', keyCode: 39, ctrlKey: false, shiftKey: false},
]

const Layout = React.lazy(() => import('./layout/Layout'));
const Login = React.lazy(() => import('./views/account/Login'));

const theme = createTheme({
    palette: {
      primary: {
        main: Colors.primary//'#FE0042'
      },
      secondary: {
        main: '#FFFFFF',
      },
    },
})

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

function App() {
  const [currentUser, setCurrentUser] = React.useState(JSON.parse(localStorage.getItem("user-base-project")))
  const [messages, setMessages] = React.useState([])
  const [resources, setResources] = React.useState({...JSON.parse(localStorage.getItem("resources-base-project") || "{}")})
  const [companyProfile, setCompanyProfile] = React.useState(JSON.parse(localStorage.getItem("company-profile-base-project")))
  
  const { current: socket } = React.useRef(getSocket())

  const keyPressEmitter = React.useRef(new EventEmitter())

  const handleKeyUp = e => {
    const {keyCode} = e
    //const {keyCode, ctrlKey, shiftKey} = e
    const keyPressEvent = keyPressEvents.find(kpe => kpe.keyCode === keyCode)
    if(keyPressEvent) keyPressEmitter.current.emit(keyPressEvent.tag, e)
  }

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    }
  }, [messages])
  
  React.useEffect(() => {
    socket.open()
    return () => { socket.close() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  React.useEffect(() => {
    if(companyProfile){
      localStorage.setItem("company-profile-base-project", JSON.stringify(companyProfile))
    }else{
      localStorage.removeItem("company-profile-base-project")
    }
  }, [companyProfile])
  
  React.useEffect(() => {
    if(currentUser && companyProfile){
      serverRequest({method: "GET", url: `/auth/resources`, user: currentUser, companyProfileId: companyProfile.id})
      .then(res => {
        setResources(res)
        localStorage.setItem("resources-base-project", JSON.stringify({...res}))
      })
      .catch(err => {
        setResources({})
      })
    }else{
      setResources({})
    }
  }, [currentUser, companyProfile])
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      if(!!messages.find(m => moment().subtract(5, "seconds").format() > m.timestamp)){
        setMessages(mss => mss.filter(m => moment().subtract(5, "seconds").format() <= m.timestamp))
      }
    }, 800)

    return () => { clearInterval(interval) }
  }, [messages])

  const authContext = React.useMemo(() => ({
    currentUser,
    resources,
    signIn: (user) => {
      localStorage.setItem("user-base-project", JSON.stringify({...user}))
      setCurrentUser({...user})
      // console.log(user)
      setCompanyProfile(({...user}.companyProfiles || [])[0])
      window.location.href = '/'
    },
    signOut: () => {
      localStorage.removeItem("user-base-project"); 
      localStorage.removeItem("resources-base-project");
      localStorage.removeItem("company-profile-base-project");
      setCurrentUser(null)
      window.location.href = "/login"
    },
  }), [currentUser, resources])

  const clientContext = React.useMemo(() => ({
    apiRequest: (
      method, 
      url, 
      params, 
      downloadFile,
      {user = currentUser, 
        contentType = undefined, 
        companyProfileId = {...companyProfile}.id
      } = {}) => serverRequest({method, url, params, user: currentUser, downloadFile, contentType, companyProfileId: {...companyProfile}.id}),
    socket,
  }), [currentUser, socket, companyProfile])


  const appContext = React.useMemo(() => ({
    message: {
      error: (body) => setMessages(m => [...m, {type: 'danger', body, timestamp: moment().format()}]),
      success: (body) => setMessages(m => [...m, {type: 'success', body, timestamp: moment().format()}]),
    },
    companyProfile,
    setCompanyProfile,
    messages,
    keyPressEmitter: keyPressEmitter.current,
  }), [messages, keyPressEmitter, companyProfile])

  return <div>
    <div className="custom-messages">
      {messages.map((message, index) => <div key={index} className={`alert alert-${message.type}`}>
        <div align="right">
          <IconButton size="small" onClick={e => setMessages(mss => mss.filter((m, i2) => index !== i2))}>
            <CloseIcon />
          </IconButton>
        </div>  
        <div>
          {message.body}
        </div>
      </div>)}
    </div>
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authContext}>
      <ClientContext.Provider value={clientContext}>
      <AppContext.Provider value={appContext}>
        <Router>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route path="/login" name="Login Page" render={props => <Login {...props}/>} />
              {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} /> */}
              {/* <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} /> */}
              {/* <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} /> */}
              
              <PrivateRoute>
                <Route path="/" name="Home" render={props => <Layout {...props}/>} />
              </PrivateRoute>
            </Switch>
          </React.Suspense>
        </Router>
      </AppContext.Provider>
      </ClientContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  </div>
}

export default App;
