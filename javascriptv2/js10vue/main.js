let data = {
    
    
    socials:[
        {
        name:`Google`,
        img: `https://castironsteak.com/wp-content/uploads/2016/01/google-square.jpg`,
    },
    {
        name:`Spotify`,
        img:`https://play-lh.googleusercontent.com/P2VMEenhpIsubG2oWbvuLGrs0GyyzLiDosGTg8bi8htRXg9Uf0eUtHiUjC28p1jgHzo`,

    },
    {
        name:`Steam`,
        img:`https://w7.pngwing.com/pngs/699/999/png-transparent-brand-logo-steam-gump-s-thumbnail.png`,

    },
    ],
    tovaru:[]
    
};

const SocialsComponent = {
    props:[`social`],
    template: `
    <div class="card" style="width: 200px; padding: 10px; margin: 10px;">
        <h2 class="text-center">{{social.name}}</h2>
        <img v-bind:src="social.img" style='width:100px; height: 100px; margin:0 auto;'>
    </div>
    `
}

const app = {
    data(){
        return data
    },
    methods: {
        
    },
    components:{
        SocialsComponent
    },
    mounted(){
        db.collection(`products`).get().then(res => {
            res.forEach(tov => {
                let product = tov.data();
                product.id = tov.id;
                this.tovaru.push(product)
            })
        })
            
    }
};

Vue.createApp(app).mount(`#test`)