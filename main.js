const WebSocketServer = require("ws").Server;
const webSocketServer = new WebSocketServer({ port: 5001 });

webSocketServer.on("connection", (targetWebSocketClient) => {
  targetWebSocketClient.on("message", (message) => {
    console.log("Received: " + message);

    if (message === "hello") {
      // WEBソケットクライアントからデータ受信した場合
      // メッセージパターンで規則作ればパターン化できる

      // クライアントにデータを加工して送り返すこともできる
      // 送信してきたクライアントのみに返す
      targetWebSocketClient.send("hello from server");
    } else {
      const { name, age } = JSON.parse(message);
      console.log(name, age);

      // クライアントへ送信
      targetWebSocketClient.send(
        JSON.stringify({
          hoge: true,
          fuga: [1, 3, 5],
          piyo: 0.5,
        })
      );
    }

    // クライアントからの接続が切れた場合のハンドリング
    targetWebSocketClient.on("close", (event) => {
      console.log(event, "lost targetClient connection");
    });

    webSocketServer.clients.forEach((client) => {
      client.send(`接続しているクライアント全てに送信        ${message}`);
    });

    webSocketServer.clients.forEach((client) => {
      console.log(client, targetWebSocketClient);
      if (client !== targetWebSocketClient) {
        client.send(
          `接続している自分以外のクライアント全てに送信          ${message}`
        );
      }
    });
  });
});
