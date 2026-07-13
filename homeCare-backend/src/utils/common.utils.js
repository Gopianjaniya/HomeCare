const os = require("os");

exports.getLocalIP = () => {
  const nets = os.networkInterfaces();
  let localIP = "127.0.0.1";

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        localIP = net.address;
      }
    }
  }
  return localIP;
};


