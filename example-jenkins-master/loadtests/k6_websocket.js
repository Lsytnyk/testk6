import ws from "k6/ws";
import { check } from "k6";

export default function() {
  const url = "ws://perfcomp.vrn.dataart.net:8000/";
  const params = { tags: { my_tag: "hello" } };

  const response = ws.connect(url, params, function(socket) {
    
	socket.on("open", function open() {
      console.log("connected");
      socket.send(Date.now());
	 });

	 socket.setInterval(function timeout() {
        socket.send("Hello");
      }, 1000);	 
	  
	socket.setInterval(function timeout() {
        socket.ping();
        console.log("Pinging every 1sec (setInterval test)");
      }, 1000);	 

    socket.on("close", () => console.log("disconnected"));

    socket.on("error", (e) => {
      if (e.error() != "websocket: close sent") {
        console.log("An unexpected error occured: ", e.error());
      }
    });

  check(response, { "status is 101": r => r && r.status === 101 });
});
}
