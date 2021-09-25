// Base By MyMans APIs
// Thanks To :
// > MineFlayer
// > MyMans
const MineFlayer = require("mineflayer") // View MineFlayer Module
const cmd = require('mineflayer-cmd').plugin// Module MineFlayer Cmd
const fs = require('fs'); // Module Fs
let data = JSON.parse(fs.readFileSync('setting.json')); // Read File

var host = data["ip"];
var username = data["namebot"]

var bot = MineFlayer.createBot({
  host: host,
  username: username
});

bot.loadPlugin(cmd)

bot.on('login',function(){
	console.log("Succes Login")
	bot.chat("§eTerimakasih telah menggunakan bot §cMyMans §ejangan lupa §csubscribe §echannel youtube §cMyMans APIs §e Ya :)");
});

bot.on('kicked',function() {
    console.log("Bot Tidak Bisa Masuk")
})

bot.on('spawn',function() {
    connected=1;
    console.log("Bot Berhasil Spawn Di Server")
});

bot.on('death',function() {
    bot.emit("respawn")
    console.log("Bot Death ~ Respawn")
});
