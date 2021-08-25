import React, { useEffect, useState } from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import { db, auth } from './firebase';
import firebase from 'firebase';
import MenuPopupState from "./components/MenuPopupState";
import Textarea from 'react-expanding-textarea';
import Linkify from 'react-linkify';

function Post({lang, postId, username, user, caption, imageUrl, imagename, viewwhichuser}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);

   
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

   
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'asc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
            
    }

    function deletePost(postId) {
        
        
        db.collection("posts").doc(postId).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.log("Error removing document: ", error);            
        });
       
        var storage = firebase.storage();

       
        var storageRef = storage.ref();

       
        var desertRef = storageRef.child('images/'+imagename);

        
        desertRef.delete().then(function() {
       
    
        }).catch(function(error) {
        

        });

    }


    function deleteComment(commentToDel) {
    
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .where("timestamp", "==", commentToDel)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
      
            doc.ref.delete(); 
      
          });
        });
      
      }

    function backtotop(){
        document.body.scrollTop = 0; 
        document.documentElement.scrollTop = 0; 
    }

    
    function viewtheirstuff(userselected) { 
        viewwhichuser(userselected);
        backtotop();
    }

     
    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                    onClick={viewtheirstuff.bind(this, username) }
                />
                <div className="post__username" onClick={viewtheirstuff.bind(this, username)}>
                    <h3>{username} </h3>
                </div>
                {
                    ( user && username === auth.currentUser.displayName || user && auth.currentUser.email === "admin@gmail.com" )
                    &&
                    <div className="delete__Post">
                   
                        <MenuPopupState 
                            lang={lang}
                            datatopass={postId}
                            functiontopass={deletePost}
                            labeltopass={lang ? "Effacer cette publication":"Delete this post"}
                        />
                    </div>

                }
                
            </div>

            <div className="post__imgcontainer">

                { 
                
                (imageUrl.includes(".mp4")) || (imageUrl.includes(".MP4")) || (imageUrl.includes(".mov")) || (imageUrl.includes(".MOV")) 
                ? 
                    (
                    <video width="100%" max-width="500" controls="true" autoplay="true" loop="true" muted="true" playsinline="true">
                        <source src={imageUrl} type='video/mp4'></source>
                        Your browser does not support the video tag.
                    </video>
                    )
                    : 
                    (
                    
                    <img className="post__image" src={imageUrl} alt="" />
                    )
                }

            </div>            
            
            
           
            <h4 className="post__text breakfix">
                {
                caption && 
                    <Linkify componentDecorator={componentDecorator}>
                        <strong onClick={viewtheirstuff.bind(this, username)}>{username}: </strong>{caption}
                    </Linkify>
                }
            </h4>
            
            <div className="post__comments">
                {comments.map((comment) => (


                    <div className="comment_container">

                        <p className="post__comment breakfix">
                            <Linkify componentDecorator={componentDecorator}>
                                <strong onClick={viewtheirstuff.bind(this, comment.username)}>
                                    {comment.username}: 
                                </strong> {comment.text}
                            </Linkify>
                            
                        </p>
                        <div className="delete__CommentButton" >
                            {
                                ( user && comment.username === auth.currentUser.displayName || user && auth.currentUser.email === "admin@gmail.com" )
                                &&
                                <div className="comment__morevert">
                                    
                                    
                                    <MenuPopupState 
                                        lang={lang}
                                        datatopass={comment.timestamp}
                                        functiontopass={deleteComment}
                                        labeltopass={lang ? "Effacez ce commentaire":"Delete this comment"}
                                    />
                                </div>
                            } 
                        </div>
                    </div>

                   
                ))}
            </div>


                {user && ( 
                    <form className="post__commentBox">
                        <Textarea
                            className="post__input"
                            type="text"
                            placeholder={lang ? "Ajoutez un commentaire":"Add a comment"}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            className="post__button"
                            disable={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                            {lang ? "Publier":"Post"}
                        </button>
                    </form>
                )}
        </div>
    )
}

export default Post
