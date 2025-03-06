import './style.css'
import Phaser from 'phaser'

const sizes = {
  width: 500,
  height: 500,
}

const speedDown = 300

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    this.player
    this.cursor
    this.playerSpeed = speedDown+50
    this.target
    this.points = 0
    this.textScore
    this.textTime
    this.timedEvent
    this.remainingTime
    this.coinMusic
    this.bgMusic
  }

  preload(){
    this.load.image("bg", "./public/assets/bg.png")
    this.load.image("apple", "./public/assets/apple.png")
    this.load.image("basket", "./public/assets/basket.png")
    this.load.audio("coin", "./public/assets/coin.mp3")
    this.load.audio("bgMusic", "./public/assets/bgMusic.mp3")
  }

  create(){
    this.coinMusic = this.sound.add("coin")
    this.bgMusic = this.sound.add("bgMusic")
    this.bgMusic.play()

    this.add.image(0,0,"bg").setOrigin(0,0)
    this.target = this.physics.add.image(0,0,"apple").setOrigin(0,0)
    this.player = this.physics.add.image(0, 400,"basket").setOrigin(0,0)

    this.player.setImmovable(true)
    this.player.body.allowGravity = false
    this.player.setCollideWorldBounds(true)
    this.player.setSize(this.player.width*75/100, this.player.height/6).setOffset(this.player.width/10, this.player.height*90/100)
    
    this.target.setMaxVelocity(0, speedDown)

    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

    this.cursor = this.input.keyboard.createCursorKeys()

    this.textScore = this.add.text(sizes.width*77/100, sizes.height/50, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    })
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    })

    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this)
  }
  
  update(){
    this.remainingTime = this.timedEvent.getRemainingSeconds()
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)

    if(this.target.y >= sizes.height)
    {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
      this.points = 0;
      this.textScore.setText(`Score: ${this.points}`)
    }

    const {left, right} = this.cursor;

    if(left.isDown)
    {
      this.player.setVelocityX(-this.playerSpeed)
    }
    else if(right.isDown)
    {
      this.player.setVelocityX(this.playerSpeed)
    }
    else
    {
      this.player.setVelocityX(0)
    }
  }

  getRandomX(){
    return Math.floor(Math.random() * 480);
  }

  targetHit()
  {
    this.target.setY(0)
    this.target.setX(this.getRandomX())
    this.points++
    this.textScore.setText(`Score: ${this.points}`)
    this.coinMusic.play()
  }

  gameOver(){
    console.log("game over")
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y: speedDown},
      debug: true
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config)