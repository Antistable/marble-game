const { ccclass, property } = cc._decorator;
const { v2 } = cc;

import * as firebase from 'firebase/app';
import 'firebase/firestore';

interface Marble {
    x: number;
    y: number;
    sprite: number;
}

@ccclass
export default class Game extends cc.Component {

    //States
    readonly Drag: number = 1;

    readonly DragOver: number = 2;

    readonly MoveStick: number = 3;

    readonly Launch: number = 4;

    readonly Settle: number = 5;

    State: number = this.Settle;


    @property(cc.Prefab)
    marblePrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    marbleSprites: cc.SpriteFrame[] = new Array(8);

    currentMarble: cc.Node = null;

    marbleList: Marble[] = [{ x: 259, y: 225, sprite: 1 }];


    @property(cc.Prefab)
    obstacle3Prefab: cc.Prefab = null;


    @property(cc.Prefab)
    linePrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    greenLineSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    redLineSprite: cc.SpriteFrame = null;

    lines: cc.Node[] = [];

    greenLineNum: number = 0;


    app: firebase.app.App;

    onLoad(): void {
        cc.director.getPhysicsManager().enabled = true;
    }

    start(): void {
        const firebaseConfig = {
            apiKey: "AIzaSyBP0Z9U6NtSzV_ew6aHGgeu0pOIfqiOJik",
            authDomain: "googlify-dev.firebaseapp.com",
            projectId: "googlify-dev",
            storageBucket: "googlify-dev.appspot.com",
            messagingSenderId: "579802640871",
            appId: "1:579802640871:web:6919d595e6f5bcd2d44d42"
        };
        this.app = firebase.initializeApp(firebaseConfig);
        cc.find("body1").zIndex = 1;
        cc.find("glass2").zIndex = 1;
        cc.find("rainbow").zIndex = 2;
        cc.find("body2").zIndex = 2;
        cc.find("Stick").zIndex = 3;
        cc.find("scenebg").zIndex = 4;
        cc.find("scene1").zIndex = 5;
        cc.find("scene2").zIndex = 5;
        cc.find("obstacle1").zIndex = 6;;
        cc.find("glass1").zIndex = 98;
        for (let index = 0; index < 7; index++) {
            this.initObstacle(448 - index * 50, 510);
        }
        for (let index = 0; index < 7; index++) {
            this.initObstacle(423 - index * 50, 550);
        }
        for (let index = 0; index < 7; index++) {
            this.initObstacle(448 - index * 50, 590);
        }
        for (let index = 0; index < 7; index++) {
            this.initObstacle(423 - index * 50, 630);
        }
        for (let index = 0; index < 8; index++) {
            this.lines[index] = this.initLine(448 - index * 50);
        }
        this.randomLines();

        this.marbleList.forEach((marble: Marble, index: number) => {
            (this.initMarble(marble) as any).index = index;
        })
    }

    initObstacle(x: number, y: number): void {
        const obstacle3: cc.Node = cc.instantiate(this.obstacle3Prefab);
        obstacle3.setPosition(v2(x, y));
        obstacle3.zIndex = 6;
        obstacle3.parent = cc.director.getScene();
    }

    initLine(x: number): cc.Node {
        const line: cc.Node = cc.instantiate(this.linePrefab);
        line.setPosition(v2(x, 467));
        line.zIndex = 6;
        line.parent = cc.director.getScene();
        return line;
    }

    randomLines(): void {
        this.greenLineNum = 0;
        for (let index = 0; index < 8; index++) {
            const isGreen: boolean = Boolean(Math.floor(Math.random() * 1.9));
            if (isGreen === true) {
                this.lines[index].getComponent(cc.Sprite).spriteFrame = this.greenLineSprite;
                this.greenLineNum += 1;
            }
            else {
                this.lines[index].getComponent(cc.Sprite).spriteFrame = this.redLineSprite;
            }
        }
        if (this.greenLineNum === 0 || this.greenLineNum === 8) {
            this.randomLines();
        }
    }

    settle(marbleX: number): void {
        let createdMarbles: cc.Node[] = [];
        const marbleLineIndex: number = Math.floor((473 - marbleX) / 50);
        if (this.lines[marbleLineIndex]?.getComponent(cc.Sprite)?.spriteFrame?.name === this.greenLineSprite.name) {
            for (let index = 0; index < 8 - this.greenLineNum; index++) {
                createdMarbles.push(this.initMarble({ sprite: Math.floor(Math.random() * 8), x: 307, y: 386 }));
            }
            this.scheduleOnce((): void => {
                createdMarbles.forEach((marble: cc.Node, index: number) => {
                    this.marbleList.push({
                        x: marble.x,
                        y: marble.y,
                        sprite: this.marbleSprites.map((sprite: cc.SpriteFrame) => { return sprite.name }).indexOf(marble.getComponent(cc.Sprite).spriteFrame.name)
                    });
                    (createdMarbles[index] as any).index = this.marbleList.length - 1;
                });
                this.updateMarbleList();
            }, 1);
        }
        this.scheduleOnce(this.randomLines, 2);
    }

    initMarble(config: Marble): cc.Node {
        const marble: cc.Node = cc.instantiate(this.marblePrefab);
        marble.setPosition(v2(config.x, config.y));
        marble.getComponent(cc.Sprite).spriteFrame = this.marbleSprites[config.sprite];
        marble.parent = cc.director.getScene();
        return marble;
    }

    updateMarbleList():void{
        const data: firebase.firestore.Firestore = firebase.firestore(this.app);
        data.collection("marble").doc("test").set({
            data: this.marbleList
        });
    }

    update(dt: number): void {
        if (this.currentMarble !== null) {
            if (this.State === this.Settle && this.currentMarble.isValid) {
                this.currentMarble.opacity -= dt * 100;
                if (this.currentMarble.opacity <= 0) {
                    this.currentMarble.destroy();
                }
            }
        }
    }
}