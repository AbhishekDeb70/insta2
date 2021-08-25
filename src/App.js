import React, { useState, useEffect} from 'react'
import './App.css';
import Post from "./Post";
import PostThumb from "./PostThumb";
import { db, auth } from "./firebase";
import {makeStyles } from '@material-ui/core/styles';
import {Modal} from '@material-ui/core';
import {Button, Input} from '@material-ui/core';
import ImageUpload from "./ImageUpload"
import InstagramEmbed from 'react-instagram-embed';
import Avatar from "@material-ui/core/Avatar";
import LazyLoad from "react-lazyload";
import MenuPopupState from "./components/MenuPopupState"
import getUserLocale from 'get-user-locale'


function backToTop(){
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function getModalStyle() {
  const top = 50; 
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Spinner = () => (
  <div className="post loading">
    <img alt="Loading..." src="https://i.gifer.com/ZZ5H.gif" width="20" />
    <h5>Loading...</h5>
  </div>
);




const locale =() => {
  
  if (getUserLocale().includes("fr")) {
    return(true)
  } else {
    return(false)
  }
}

function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [viewmine, setViewMine] = useState(false);
  const [viewwhichuser, setViewWhichUser] = useState('');
  const [viewsinglepost, setViewSinglePost] = useState(false);
  const [singlepostid, setSinglePostId] = useState('');
  const [lang, setLang] = useState(locale);

  
  const toggleLang = () => setLang(!lang);


  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
       
        setUser(authUser);

      } else {
        
        setUser(null);
      }
      
    })

    return () => {
      
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
      
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
       
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      })
  }, []);

  

  const signUp = (event) => {

    
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

   
    

    
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    
   
    setOpenSignIn(false);
  }

  function home() {
    setViewMine(false); 
    setViewWhichUser(''); 
    setViewSinglePost(false); 
    backToTop();    
  }


  return (
    <div className="app">

      <Modal  
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                height="40px;"
                              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input 
              type="text"
              placeholder={lang ? "Nom d'utilisateur":"username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /> 
            <Input 
              placeholder={lang ? "Courriel":"email"}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder={lang ? "Mot de passe":"password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>{lang ? "Inscrivez-vous":"Sign Up"}</Button>

          </form>

        </div>
      </Modal>

      <Modal  
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                height="40px;"
                alt=""
              />
            </center>

            <Input 
              placeholder={lang ? "Courriel":"email"}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              placeholder={lang ? "Mot de passe":"password"}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>{lang ? "Connectez-vous":"Sign In"}</Button>

          </form>

        </div>
      </Modal>

      <header className="app__header">
        <img 
          className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          height="40px;"
          alt=""
        />

        <div className="app__loginContainer">

              <div className="loginLeft">
                { user ? (
                  <Button onClick={() => auth.signOut()}>{lang ? "Déconnecter":"Logout"}</Button>
                ) : (
                  <Button onClick={() => toggleLang()}>{lang ? "EN":"FR"}</Button>
                )
                }
                
                
             </div>

            <div className="loginRight">
              <Button  aria-controls="fade-menu" aria-haspopup="true" > 
                <MenuPopupState 
                  topmenu={true}
                  lang={lang}
                  user={user}
                  functiontopass={toggleLang}
                  labeltopass={lang ? "English Version" : "Version française"}
                  signout={() => auth.signOut()}
                  signoutlabel={lang ? "Déconnecter":"Logout"}
                  signin={() => setOpenSignIn(true)}
                  signinlabel={lang ? "Me Connecter" : "Sign In"}
                  signup={() => setOpen(true)}
                  signuplabel={lang ? "M'enregistrer" : "Sign Up"}
                />
              </Button>

            </div>

          </div>
        

      </header>

        <div className="app__posts">
          <div className="app__postsLeft">
            {
            
            (viewmine && user)  ? (
              
              <div className="post__thumbs">
              
             {

              posts.filter(({id, post}) => post.username === auth.currentUser.displayName).map(({id, post}) => (
              
                
                <LazyLoad 
                  key={id}
                  height={100}
                  offset={[-100, 100]}
                  placeholder={<Spinner />}
                  >
                    <div onClick={() => {setViewSinglePost(true); setSinglePostId(id); setViewMine(false); setViewWhichUser(null); backToTop(); }}>
                      <PostThumb 
                          key={id}
                          lang={lang}
                          postId={id}
                          user={user}
                          username={post.username}
                          caption={post.caption}
                          imageUrl={post.imageUrl}
                      />
                    </div>
                  </LazyLoad>


               ))}
              </div>


              ) : (viewwhichuser)  ? ( 
                              
                  <div className="post__thumbs">
                  
                {

                  posts.filter(({id, post}) => post.username === viewwhichuser).map(({id, post}) => (
                    
                    <LazyLoad 
                    key={id}
                    height={100}
                    offset={[-100, 100]}
                    placeholder={<Spinner />}
                    >
                      <div onClick={() => {setViewSinglePost(true); setSinglePostId(id); setViewMine(false); setViewWhichUser(null); backToTop(); }}>
                        <PostThumb 
                            key={id}
                            lang= {lang}
                            postId={id}
                            user={user}
                            username={post.username}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                        />
                      </div>
                    </LazyLoad> 
                   

                  ))}
                  </div>
                          

            ) : viewsinglepost ? ( 
                    
              posts.filter(({id, post}) => id === singlepostid).map(({id, post}) => (
                <Post 
                    key={id}
                    lang={lang}
                    postId={id}
                    user={user}
                    username={post.username}
                    caption={post.caption}
                    imageUrl={post.imageUrl}
                    imagename={post.imagename}
                    viewwhichuser={setViewWhichUser}
                    viewsinglepost={setViewSinglePost}
                />                             
              ))
                  
            ) : (

              
            
              posts.map(({id, post}) => (

                <LazyLoad 
                  key={id}
                  height={100}
                  offset={[-100, 100]}
                  placeholder={<Spinner />}
                  >
                    <Post 
                        key={id}
                        lang={lang}
                        postId={id}
                        user={user}
                        username={post.username}
                        caption={post.caption}
                        imageUrl={post.imageUrl}
                        imagename={post.imagename}
                        viewwhichuser={setViewWhichUser}
                        viewsinglepost={setViewSinglePost}
                    />  
                  </LazyLoad>

              ))

            )
            }

          </div>
          <div className="app__postsRight no-mobile">
            <InstagramEmbed
              className="floating"
              url="https://instagr.am/p/CAX8psZMEdL_Lkto_rA_8oIhfVE1IJNLUobpkc0/"
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />

          </div>
        </div>

      <footer className="footer">

       
        {user ? (

          <div>
            <Modal  
              open={openImageUpload}
              onClose={() => setOpenImageUpload(false)}
            >
              <ImageUpload 
                lang={lang}
                username={user.displayName} 
                closemodal={setOpenImageUpload} 
               
                viewwhichuser={setViewWhichUser}
                viewsinglepost={setViewSinglePost}

              />
            </Modal>
            

            <div className="footer__icons">
              <div className="footer__left">
                <img onClick={home} className="app__home" src="https://toogreen.ca/instagreen/img/home.svg" alt='home icon to go back up'/>         
              </div>

              <div className="footer__middle">
                <img onClick={() => setOpenImageUpload(true)} className="app__add-postImg" src="https://toogreen.ca/instagreen/img/add-post.svg" alt='plus icon to add posts'/>
              </div>

              <div className="footer__right">
                  <Avatar 
                      onClick={()=> {setViewMine(true); backToTop();}}
                      className="footer__avatar"
                      alt={username}
                      src="https://toogreen.ca/instagreen/static/images/avatar/1.jpg"
                  />  
              </div>
            </div>

          </div>
        ): (
          <div className="footer__icons">
              <div className="footer__left">
                <img onClick={home} className="app__home" src="https://toogreen.ca/instagreen/img/home.svg" alt='home icon to go back up'/>         
              </div>
              <div className="footer__middle">
                  <Button onClick={() => setOpenSignIn(true)}>
                    {lang ? "CONNEXION":"SIGN IN"} &nbsp;&nbsp;
                  </Button> 
                  <Button onClick={() => setOpen(true)}>
                    {lang ? "INSCRIPTION":"SIGN UP"}
                  </Button>
                  
              </div>
              <div className="footer__right">
                  &nbsp;
              </div>                       
          </div>
          
        )}  
      </footer>
    </div>
  );
}

export default App;
