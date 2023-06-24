const firebaseConfig = {
    apiKey: "AIzaSyDLxX3GRuHSBX0nsdfJKCIoimvzlmD8aZQ",
    authDomain: "studylinkvlad.firebaseapp.com",
    projectId: "studylinkvlad",
    storageBucket: "studylinkvlad.appspot.com",
    messagingSenderId: "758503050538",
    appId: "1:758503050538:web:aab60135cda02a6c8d2253"
  };
  firebase.initializeApp(firebaseConfig);

    var db = firebase.firestore();
    let web_users = [];
    db.collection('user_test').get().then(function(res){
        res.forEach(function(doc){
            let user = doc.data()
            user.id = doc.id;
        web_users.push(user)

    });
}); 
  console.log(web_users);      
            

function check_sign(){
    let email = document.getElementById(`email`).value
    let password = document.getElementById(`password`).value
    for(i=0; i<web_users.length; i++){
    if(web_users[i].email == email){
            if(web_users[i].password == password){
                localStorage.setItem('sign_in', JSON.stringify
                (web_users[i]))
            }
        }
    }
}