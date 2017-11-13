const users=require("./users");
const WebHook=require("./webHook")
const database=require("./database");

function ChatWorker(){
    const base=this;
    const webHook=new WebHook(this);
    
    base.send=function(model){
        var json=JSON.stringify(model);
        base.socket.send(json);
    },

    base.sendInitialData=function(){
        var user=users.activeUser();
        var persistent_menu=database.getData("persistent_menu");
        var images=database.getData("images")||require("../data/images");
        var data={user,persistent_menu,images};
        base.send(data);
    }

    base.sendActiveUser=function(){
        var user=users.activeUser();
        var data={user};
        base.send(data);
    }

    base.start = function (server) {
        server.on("connection", socket => {
            base.socket=socket;
            socket.on("message",message=>{
                var object=JSON.parse(message);
                webHook.dispatch(object);
            })   
            
            base.sendInitialData();
        })
    }
}

module.exports = new ChatWorker();