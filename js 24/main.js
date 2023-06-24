function addObjects(cadr_mass){
    let cards = document.getElementById(`cards`);
    let cards_html = ` `;
    cadr_mass.map(function(phone){
        let action = ``;
        if(phone.action == true){
             action = `<div class="action">Акція</div>`
        }
        

        cards_html += `
        <div class="card">
            ${action}   
            <img src=${phone.image}>
            <div class="card-body">
                <h6 class="card-title">${phone.name}</h6>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Виробник:</b> <span>${phone.developer}</span></li>
                    <li class="list-group-item"><b>Відгуків:</b> <span>${phone.reviews}</span></li>
                    <li class="list-group-item"><b>Ціна:</b> <span>${phone.price}₴</span></li>
                </ul>
            </div>
            <div class="card-body price">
							<a href="#" class="card-link">В корзину</a>
							<a href="#" class="card-link">Придбати</a>
						  </div>
					</div>`
						
    });



    cards.innerHTML = cards_html;
};
addObjects(phones)

function findDevelopers(){
    let developers = [];


    phones.map(function(phone){
        
        if(developers.indexOf(phone.developer) === -1){
            developers.push(phone.developer)
        }else{

        };
        

    });
    let datalistOptions = document.getElementById(`datalistOptions`);
    let options = ``;
    developers.map(function(dev){
        options += `<option value="${dev}">`;
    });


    datalistOptions.innerHTML = options;
};
findDevelopers();

function saveFilter(){
    let object = {
        developer: document.getElementById(`developer`).value,
        name: document.getElementById(`name`).value,
        min_price: document.getElementById(`min_price`).value,
        max_price: document.getElementById(`max_price`).value,
        order: document.getElementById(`order`).value
    }
    localStorage.setItem("filter", JSON.stringify(object));

    redrawCards(object)

};

function redrawCards(object){
    let new_phones = phones.slice();
    if(object.name.length > 0){
        new_phones = new_phones.filter(function(phone){
            return phone.name.includes(object.name)
        })
    }
    

    if(object.developer.length > 0){
        new_phones = new_phones.filter(function(phone){
            return phone.developer === object.developer;
        })
    }

    if(object.min_price.length > 0){
        new_phones = new_phones.filter(function(phone){
            return object.min_price <= phone.price;
        })
    }

    if(object.max_price.length > 0){
        new_phones = new_phones.filter(function(phone){
            return object.max_price >= phone.price;
        })
    }
    
    if(object.order.length > 0 && object.order === "price" ){
        new_phones = new_phones.sort(function(a, b){
            return a.price - b.price
        })
    }

    if(object.order.length > 0 && object.order === "reviews" ){
        new_phones = new_phones.sort(function(a, b){
            return b.reviews - a.reviews
        })
    }
addObjects(new_phones);

};



let object_filter = JSON.parse(localStorage.getItem("filter"));

if(object_filter){

    redrawCards(object_filter)
}else{
    addObjects(new_phones)
}
