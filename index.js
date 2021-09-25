// Base By MyMans APIs
// Thanks To :
// > MineFlayer
// > MyMans
// > TheDude FromCI
const MineFlayer = require("mineflayer") // View MineFlayer Module
const cmd = require('mineflayer-cmd').plugin
// Module MineFlayer Cmd
const fs = require('fs'); // Module Fs
const pvp = require('mineflayer-pvp').plugin // Module
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder') // Module
const armorManager = require('mineflayer-armor-manager') // Module
let data = JSON.parse(fs.readFileSync('setting.json'));
 // Read File

var host = data["ip"];
var username = data["namebot"]

var Mans = MineFlayer.createBot({
  host: host,
  username: username
});

Mans.loadPlugin(cmd)

Mans.on('login',function(){
	console.log("Succes Login")
	Mans.chat("Terimakasih telah menggunakan bot MyMans jangan lupa subscribe channel youtube MyMans APIs Ya, Jadikan bot admin!!!");
});

Mans.on('kicked',function() {
    console.log("Disconnect...")
})

Mans.on('spawn',function() {
    connected=1;
    console.log("Bot Spawn Successfully On Server")
});

Mans.on('death',function() {
    Mans.emit("respawn")
    console.log("[ Death ] Wait ~ Respawn")
});

Mans.loadPlugin(pvp)
Mans.loadPlugin(armorManager)
Mans.loadPlugin(pathfinder)

Mans.on('playerCollect', (collector, itemDrop) => {
  if (collector !== Mans.entity) return

  setTimeout(() => {
    const sword = Mans.inventory.items().find(item => item.name.includes('sword'))
    if (sword) Mans.equip(sword, 'hand')
  }, 150)
})

Mans.on('playerCollect', (collector, itemDrop) => {
  if (collector !== Mans.entity) return

  setTimeout(() => {
    const shield = Mans.inventory.items().find(item => item.name.includes('shield'))
    if (shield) Mans.equip(shield, 'off-hand')
  }, 250)
})

let guardPos = null

function guardArea (pos) {
  guardPos = pos.clone()

  if (!Mans.pvp.target) {
    moveToGuardPos()
  }
}

function stopGuarding () {
  guardPos = null
  Mans.pvp.stop()
  Mans.pathfinder.setGoal(null)
}

function moveToGuardPos () {
  const mcData = require('minecraft-data')(Mans.version)
  Mans.pathfinder.setMovements(new Movements(bot, mcData))
  Mans.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

Mans.on('stoppedAttacking', () => {
  if (guardPos) {
    moveToGuardPos()
  }
})

Mans.on('physicTick', () => {
  if (Mans.pvp.target) return
  if (Mans.pathfinder.isMoving()) return

  const entity = Mans.nearestEntity()
  if (entity) Mans.lookAt(entity.position.offset(0, entity.height, 0))
})

Mans.on('physicTick', () => {
  if (!guardPos) return

  const filter = e => e.type === 'mob' && e.position.distanceTo(Mans.entity.position) < 16 &&
                      e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

  const entity = Mans.nearestEntity(filter)
  if (entity) {
    Mans.pvp.attack(entity)
  }
})

Mans.on('chat', (usernames, message) => {
  console.log("[ SERVER CHAT ] : " + message)
  if (message === 'guard') {
    const player = Mans.players[usernames]

    Mans.chat('I will guard that location.')
    guardArea(player.entity.position)
  }

  if (message === 'fight me') {
    const player = Mans.players[usernames]

    if (!player) {
      Mans.chat("I can't see you.")
      return
    }

    Mans.chat('Prepare to fight!')
    Mans.pvp.attack(player.entity)
  }

  if (message === 'stop') {
    Mans.chat('I will no longer guard this area.')
    stopGuarding()
  }
  if (message === 'bot') {
    Mans.chat('Aku anak mojang kak :), hehehe')
  }
})
