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
  let users = [];
  db.collection('users').get().then(function(res){
    res.forEach(function(doc, index){
        let doc_user = doc.data();
        users.push(doc.user);
        let id = doc.id;
        drawUsers(doc_user, index, id);
    })
  })
function drawUsers(user, index, id){
 let tbody = document.getElementById(`tbody`);
 let trs = `
 <tr id=${id}>
				<th scope="row">${users.length}</th>
				<td>${user.name}</td>
				<td>${user.lastname}</b></td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
				<td class="text-center"><button class="btn btn-warning btn-sm" onclick = showModal('editTaskModal','${id}')>Редагувати</button></td>
				<td class="text-center"><button class="btn btn-danger btn-sm" onclick = deleteDoc('${id}')>x</button></td>
			  </tr>
 `;

 tbody.innerHTML += trs;
}
function deleteDoc(id){
  db.collection('users').doc(id).delete().then(function(){
    console.log(`видалено`)
    location.reload();
  })
}
function add(){
  
  let new_user = {
    name: document.getElementById('name').value,
    lastname:document.getElementById('lastname').value ,
    email:document.getElementById('email').value ,
    password: document.getElementById('phone').value
}
db.collection('user_test').add(new_user).then(function(){
  closeModal()
location.reload()
})

}
function closeModal(id){
  document.getElementById(id).classList.remove('show'); 
  location.reload();
}
function showModal(id, docid){
  document.getElementById('save').setAttribute('onclick', `editUser('${docid}')`)
  document.getElementById(id).classList.add('show');
  modalGetUser(docid)
}

function modalGetUser(id){
  db.collection(`users`).doc(id).get().then(function(res){
    let data = res.data();
    document.getElementById(`name_edit`).value = data.name;
    document.getElementById(`lastname_edit`).value = data.lastname;
    document.getElementById(`email_edit`).value = data.email;
    document.getElementById(`phone_edit`).value = data.phone;
  })
};

function editUser(id){
  const user = {
    name: document.getElementById(`name_edit`).value,
    lastname: document.getElementById(`lastname_edit`).value ,
    email: document.getElementById(`email_edit`).value,
    phone: document.getElementById(`phone_edit`).value
}
db.collection("users").doc(id).update(user).then( function(){
   
    console.log("Document is updated!")

closeModal('editTaskModal')
location.reload();
});

}