



document.addEventListener('DOMContentLoaded', async function(){
    let card_template = await axios.get("templates/card.html");
   
const data = {
    message:`Привіт`,
    products: []
};

const CardCom = {
    props: ['product'],
    template: card_template.data,
    methods:{
        countTotalPrice(){
            let predOrderPrice = 0;
            let fastDeliveryPrice = 0;
            let productsPrice = this.product.price * this.product.count
            if(this.product.predOrder){
                predOrderPrice = productsPrice * 0.05;
            }
            if(this.product.fast){
                fastDeliveryPrice = productsPrice * 0.1
            }
            this.product.TotalPrice = productsPrice - predOrderPrice + fastDeliveryPrice;
            console.log(productsPrice)
        }
        
    }
}

const drawProducts = {
    data(){
        return data
    },
    methods:{
        getProducts(category){
            this.products = [];
            db.collection(category).get().then(res => {

                res.forEach(doc => {
                    let product = doc.data();
                    product.id = doc.id;
                    this.products.push(product);
                })
                
            })
        }
    },
    components:{
        'card': CardCom
    },
    mounted(){
        this.getProducts(`phones`)
    }
}
Vue.createApp(drawProducts).mount('#tovari')


})
