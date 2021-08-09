var WebSocket=require('ws');
var Events={};
exports.StartNeutron=function(){
    var Ws=new WebSocket("ws://localhost:16384");
    Ws.on("message",(message)=>{
        let Message=JSON.parse(message.toString());
        Events[Message["Type"]](Message["Data"]);
    });
};
exports.Listener=function(Event,callback){
    Events[Event]=callback;
    Ws.send(`{"Event":"sub","EventName":${Event}}`);
}
exports.CancelListener=function(Event){
    delete Events[Event];
    Ws.send(`{"Event":"can","EventName":${Event}}`);
}
exports.Game={
    ExecCommand:function(Command){
        Ws.send(`{"Event":"Game","EventName":"ExecCommand","Command":${Command}}`);
    }
}