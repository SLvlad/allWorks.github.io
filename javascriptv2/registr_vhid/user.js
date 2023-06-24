let user_id = new URL(window.location.href).searchParams.get("id");

function vivid(id){
    db.collection('reg_test').doc(id).get().then( res=> {
        console.log(res.data())
    })
}
vivid(user_id)