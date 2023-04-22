//Asset Credits:- Tuxemon, https://github.com/Tuxemon/Tuxemon


var choice = new Array(10);
var i = 0;
var curr_role;
var balance;

function generateRole() {
  const roles = ["Student", "Doctor", "Driver"];
  curr_role = roles[Math.trunc(Math.random()*3)%3];
  balance;
  if(curr_role = "Student"){
    balance = 2000;
  }
  else if(curr_role = "Doctor"){
    balance = 40000;
  }
  else{
    balance = 10000;
  }
}

// Phaser 3 configuration to setup the display and scene.
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    parent: "game-container",
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
};

  const game = new Game(config);
  let cursors;
  let player;
  let showDebug = false;

  // Preload function to set up assets on the screen.
  function preload() {
    this.load.image("tiles", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON("map", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json");
    this.load.atlas("atlas", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png", "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json");
  }
  
  // Create tilemap, tilesets and define its layers.
  function create() {

    generateRole();

    this.startTime = this.time.now;

    const map = this.make.tilemap({ key: "map" });
  
    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)

    const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");
  
    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
    const worldLayer = map.createLayer("World", tileset, 0, 0);
    const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
  
    worldLayer.setCollisionByProperty({ collides: true });
  
    // By default, everything gets depth sorted on the screen in the order we created things. Here, we
    // want the "Above Player" layer to sit on top of the player, so we explicitly give it a depth.
    // Higher depths will sit on top of lower depth objects.
    aboveLayer.setDepth(10);
  
    // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
    // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
    const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
  
    // Create a sprite with physics enabled via the physics system. The image used for the sprite has
    // a bit of whitespace, so I'm using setSize & setOffset to control the size of the player's body.
    player = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
      .setSize(30, 40)
      .setOffset(0, 24);
  
    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(player, worldLayer);
  
    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    const anims = this.anims;
    anims.create({
      key: "misa-left-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-right-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-front-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
    anims.create({
      key: "misa-back-walk",
      frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
      frameRate: 10,
      repeat: -1
    });
  

    // Camera is initialized here, it follows the player char and has bounds.  
    const camera = this.cameras.main;
    camera.startFollow(player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  
    cursors = this.input.keyboard.createCursorKeys();

  }

  // Movement and keydown conditions
  function update(time, delta) {

    this.add
      .text(260, 560, "Balance: "+balance, {
        font: "12px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000000"
      })
      .setScrollFactor(0)
      .setDepth(90);

    const elpasedTime = (this.time.now - this.startTime) * 1000;

    const speed = 150;
    const prevVelocity = player.body.velocity.clone();
  
    // Stop any previous movement from the last frame
    player.body.setVelocity(0);
  
    // Horizontal movement
    if (cursors.left.isDown) {
      player.body.setVelocityX(-speed);

    } else if (cursors.right.isDown) {
      player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown) {
      player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
      player.body.setVelocityY(speed);
    }
  
    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);
  
    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
      player.anims.play("misa-left-walk", true);
    } else if (cursors.right.isDown) {
      player.anims.play("misa-right-walk", true);
    } else if (cursors.up.isDown) {
      player.anims.play("misa-back-walk", true);
    } else if (cursors.down.isDown) {
      player.anims.play("misa-front-walk", true);
    } else {
      player.anims.stop();
  
      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
      else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
      else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
      else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
    
      if(elpasedTime == 1000){
        this.add
        .text(16, 16, "Make a choice:\nPress(a) for Science Degree\nPress(b) for Medical Degree", {
          font: "12px monospace",
          fill: "#000000",
          padding: { x: 20, y: 10 },
          backgroundColor: "#ffffff"
        })
        .setScrollFactor(0)
        .setDepth(30);

        this.aKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.a);
        this.bKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.b);

        if (this.aKey.isDown){
          this.add.clear();
          choice[i++] = "Science";
        }
        else if (this.bKey.isDown){
          this.add.clear();
          choice[i++] = "Medical"
        }

      }

      if(elpasedTime == 2000){
        this.add
        .text(16, 16, "Make a choice:\nPress(a) for Electric Vehicle\nPress(b) for Petrol Vehicle", {
          font: "12px monospace",
          fill: "#000000",
          padding: { x: 20, y: 10 },
          backgroundColor: "#ffffff"
        })
        .setScrollFactor(0)
        .setDepth(30);

        this.aKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.a);
        this.bKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.b);

        if (this.aKey.isDown){
          this.add.clear();
          choice[i++] = "EV";
          balance-=100000;
        }
        else if (this.bKey.isDown){
          this.add.clear();
          choice[i++] = "Petrol";
          balance-=50000;
        }
      }
    }
  }
