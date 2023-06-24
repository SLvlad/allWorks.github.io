let test = {
    title: `Привіт, поклікаєм?`,
    clicks: 0
}

const testVue = {
    data(){
        return test
    },
    methods: {
        clickRah(){
            this.clicks++;

        }
    },
    mounted(){

    }
}
Vue.createApp(testVue).mount(`#app`);