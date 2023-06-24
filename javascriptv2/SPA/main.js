document.addEventListener('DOMContentLoaded', async function(){
    let not_found = await axios.get('templates/404.html');
    let home =      await axios.get('templates/home.html');
    let products =      await axios.get('templates/products.html');
    let login =      await axios.get('templates/login.html');


    const data = {
        test: 'Привіт',
        currentPath: window.location.hash,
        content: []
    }


    const Home = {
        template: home.data
    }


    const NotFound = {
        template: not_found.data
    }


    const Products = {
        template: products.data,
        methods: {
            getProducts(){
                db.collection('products').get().then(res => {
                    this.$root.content = [];
                  res.forEach( doc => {
                    let prod = doc.data();
                    prod.id = doc.id;
                    this.$root.content.push(prod)
                                  })
                            this.$root.forceUpdate();      
                            this.forceUpdate();      
                })
            }
        },
        mounted(){
            this.getProducts();
        }
    }

    const Login = {
        template: login.data,
        methods: {
            googleAuth(){
                firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    var user = result.user;
    let new_user = {
        name: user.displayName,
        email: user.email,
        login: "LOL"
    }
    db.collection('testReg').doc(user.uid).add(new_user).then(
        res=>{
            console.log(`Успіх!!!`)
        }
    )

     
  }).catch((error) => {
   
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
  });
            }
        }

    }

    const routes = {
        '/': Home,
        '/not-found': NotFound,
        '/products' : Products,
        '/SignUp': Login
    }








    const app = {
        data(){
            return data
        },
        methods: {
           
        },
        components: {
           
        },
        computed: {
            currentView(){
                return routes[this.currentPath.slice(1) || '/' || NotFound]
                console.log(this.currentPath.slice(1))
                console.log(this.currentPath)
            }
        },
        mounted(){
            window.addEventListener('hashchange', () => {
                this.currentPath = window.location.hash;
                console.log('hash change')
            });
           


        }
    }
    Vue.createApp(app).mount('#app')
})


