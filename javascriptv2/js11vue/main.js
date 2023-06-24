const data = {
    test: `hello`,
    comments:[],
    NewComment:{
        name:``,
        text:``
    }
}
const CommentComponent = {
    props:[`comm`],
    template: `
    <div class="card mb-3">
    <div class="d-flex">
      <div class="userlogo_box">
          <div class="username">
                {{comm.name.slice(0,1)}}
          </div>
      </div>
      <div class="pl-3">
          <h5>{{comm.name}}</h5>
          <p>
            {{comm.text}}
          </p>
      </div>
    </div>
  </div>
    `
}

const app = {
    data(){
        return data 
    },
    methods:{
        getComments(){
            db.collection(`comments`).get().then(res => {
                this.comments = [];
                res.forEach(doc => {
                    let comment = doc.data();
                    comment.id = doc.id;
                    this.comments.push(comment)
                })
            })
        },
        addNewComment(){
            db.collection(`comments`).add(this.NewComment).then(res => {
                console.log(`success`)
                this.NewComment.name = ` `;
                this.NewComment.text = ` `;
                this.getComments()
            })
        }
    },
    components:{
        CommentComponent
    },
    mount(){
        this.getComments()
    }
}

Vue.createApp(app).mount(`#app`);