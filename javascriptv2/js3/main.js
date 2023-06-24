const firebaseConfig = {
    apiKey: "AIzaSyA-dpY8BBBi1aGa6wMKY5khrPS1lugOYqI",
    authDomain: "study-link-sb14.firebaseapp.com",
    projectId: "study-link-sb14",
    storageBucket: "study-link-sb14.appspot.com",
    messagingSenderId: "304833811149",
    appId: "1:304833811149:web:1784ab46fb87e4ec1f4f84"
};

        firebase.initializeApp(firebaseConfig);

        var db = firebase.firestore();


        function saveUser(){
            let user = {
                name: document.getElementById(`name`).value,
                lastname: document.getElementById(`lastname`).value,
                email: document.getElementById(`email`).value,
                phone: document.getElementById(`phone`).value
            }
            db.collection('users').add(user);
        }