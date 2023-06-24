var provider = new firebase.auth.GoogleAuthProvider();
function googleVhid(){
    firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    var user = result.user;
    console.log(result);
    console.log(user);
    createUser(user.uid)
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
  });
}

function EmailPassVhid(){

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log(userCredential)
    console.log(user)
    createUser(user.uid, nam.value, lastname.value, age.value)
    window.location.href = `user.html?id=${user.uid}`
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log(errorCode)
    console.log(errorMessage)
  });
}

function createUser(id, name, lastname, age){
    let user = {
        name: name,
        lastname: lastname,
        age: age
    }
    db.collection('reg_test').doc(id).set(user).then(res => {
        console.log('успіх')
    })
}
