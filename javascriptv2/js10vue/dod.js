function DrawTovar(){
    let tovar = {
        name:document.getElementById('name').value,
        price:document.getElementById('price').value,
        img:document.getElementById('img').value,
        developer:document.getElementById('developer').value,
        reviews:document.getElementById('reviews').value,
        category:document.getElementById('category').value,
    }
    db.collection(tovar.category).add(tovar).then(function(){
        location.reload();
    })

}