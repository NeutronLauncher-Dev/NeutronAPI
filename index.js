var WebSocket=require('ws');
var Events={},Ws;
exports.StartNeutron=function(callback){
    Ws=new WebSocket("ws://localhost:16384");
    Ws.on("open",()=>{
        var Listener=function(Event,ListenCallback){
            Events[Event]=ListenCallback;
            Ws.send(`{"Event":"sub","EventName":"${Event}"}`);
        }
        var cancelListener=function(Event){
            if(Events[Event]!=undefined){
                delete Events[Event];
                Ws.send(`{"Event":"can","EventName":"${Event}"}`);
            }else throw new Error("Cancel unsub event."); 
        }
        var Game={
            ExecCommand:function(Command){
                Ws.send(`{"Event":"Game","EventName":"ExecCommand","Command":"${Command}"}`);
            }
        }
        callback(Listener,cancelListener,Game);
    });
    Ws.on("message",(message)=>{
        let Message=JSON.parse(message.toString());
        Events[Message["Type"]](Message["Data"]);
    });
};