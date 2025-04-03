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
    }

    create ()
    {
        this.add.image(400, 300, 'sky');
        
        this.suelos=this.physics.add.staticGroup();

        this.suelos.create(400, 568, 'ground').setScale(2).refreshBody();

        this.suelos.create(600, 400, 'ground');
        this.suelos.create(50, 250, 'ground');
        this.suelos.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 450, 'dude');

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

        this.physics.add.collider(this.player, this.suelos);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.inicializarEstrellas();
        
    }

    inicializarEstrellas(){
        this.stars = this.physics.add.group();
        var i=0;
        for(i=0;i<11;i++){
            var star=this.stars.create(12+(i*70), 0, 'star');
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        this.physics.add.collider(this.stars, this.suelos);

        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);
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
