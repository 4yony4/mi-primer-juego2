import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {

        this.load.setPath('assets');
        
        this.load.image('background', 'bg.png');
        this.load.image('logo', 'logo.png');

        this.load.image('sky', 'sky.png');
        this.load.image('ground', 'platform.png');
        this.load.image('star', 'star.png');
        this.load.image('bomb', 'bomb.png');
        this.load.spritesheet('dude', 'dude.png', { frameWidth: 32, frameHeight: 48 });

        // Load the tileset image
        this.load.image('tileset1', 'tilesets/tileset1.png');

        // Load the tilemap
        this.load.tilemapTiledJSON('mapa1', 'tilemaps/mapa1.json');
    }

    create ()
    {
        this.add.image(400, 300, 'sky');

        this.inicializarMapa();

        this.score = 0;
        this.scoreText = this.add.text(50, 50, 'score: 0', { fontSize: '32px', fill: '#000' });
        
        /*this.suelos=this.physics.add.staticGroup();

        this.suelos.create(400, 568, 'ground').setScale(2).refreshBody();

        this.suelos.create(600, 400, 'ground');
        this.suelos.create(50, 250, 'ground');
        this.suelos.create(750, 220, 'ground');*/

        this.player = this.physics.add.sprite(100, 0, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //this.player.body.setGravityY(30);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 100,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 100,
            repeat: -1
        });

        //this.physics.add.collider(this.player, this.suelos);
        

        this.cursors = this.input.keyboard.createCursorKeys();

        this.inicializarEstrellas();

        this.inicializarBombas();

        this.inicializarColisiones();
        
        
    }

    inicializarColisiones(){

        this.physics.add.collider(this.player, this.colTierraOjects);
    }

    inicializarMapa(){
        // Create the tilemap
        var mapa1 = this.make.tilemap({ key: 'mapa1' });

        // Add the tileset image used in Tiled (name must match the name in Tiled)
        var tileset1 = mapa1.addTilesetImage('tileset1', 'tileset1');
        var capaTierra = mapa1.createLayer('Tierra', tileset1, 0, 0);

        var colTierraLayer = mapa1.getObjectLayer('ColTierra');

        this.colTierraOjects = this.physics.add.staticGroup();

        colTierraLayer.objects.forEach(obj => {
            
            var collider = this.colTierraOjects.create(obj.x, obj.y, null);
            collider.setSize(obj.width, obj.height);
            collider.setVisible(false); // if you don't want to see it
            collider.body.setOffset(0, 20);
        });

        

    }

    inicializarEstrellas(){
        this.stars = this.physics.add.group();
        var i=0;
        for(i=0;i<11;i++){
            var star=this.stars.create(12+(i*70), 0, 'star');
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        //this.physics.add.collider(this.stars, this.suelos);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);

        this.score+=10; //this.score=this.score+10;
        this.scoreText.setText('Score: ' + this.score);

        if(this.stars.countActive(true)==0){
            var i=0;
            for(i=0;i<this.stars.getChildren().length;i++){
                var starTemp=this.stars.getChildren()[i];
                starTemp.enableBody(true, starTemp.x, 0, true, true);
            }


            var x=0;
            if(this.player.x<400){
                x=Phaser.Math.Between(400, 800);
            }
            else{
                x=Phaser.Math.Between(0, 400);
            }

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    inicializarBombas(){
        this.bombs = this.physics.add.group();

        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
    }

    update(){
        if (this.cursors.left.isDown || this.input.keyboard.addKey("A").isDown)
        {
            this.player.setVelocityX(-160);
        
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
        
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
        
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }

        if (this.cursors.space.isDown)
        {
            this.player.setVelocityY(-330);
        }



    }
}
