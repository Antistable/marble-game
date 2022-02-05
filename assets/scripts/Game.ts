const { ccclass, property } = cc._decorator;
const { v2 } = cc;
const { TOUCH_END } = cc.Node.EventType;

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

    marbleList: Marble[] = [{ x: 307, y: 386, sprite: 0 }, { x: 307, y: 386, sprite: 1 }, { x: 307, y: 386, sprite: 2 }, { x: 307, y: 386, sprite: 3 }, { x: 307, y: 386, sprite: 4 }, { x: 307, y: 386, sprite: 5 }, { x: 307, y: 386, sprite: 6 }, { x: 307, y: 386, sprite: 7 }, { x: 307, y: 386, sprite: 8 }];


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

    doc: firebase.firestore.DocumentReference;

    onLoad(): void {
        cc.director.getPhysicsManager().enabled = true;

        cc.find("abort").on(TOUCH_END, (): void => {
            if (this.State === this.Launch) {
                this.currentMarble.destroy();
                this.State = this.Settle;
                this.randomLines();
            }
        })

        const firebaseConfig = {
            apiKey: "AIzaSyBP0Z9U6NtSzV_ew6aHGgeu0pOIfqiOJik",
            authDomain: "googlify-dev.firebaseapp.com",
            projectId: "googlify-dev",
            storageBucket: "googlify-dev.appspot.com",
            messagingSenderId: "579802640871",
            appId: "1:579802640871:web:6919d595e6f5bcd2d44d42"
        };
        this.app = firebase.initializeApp(firebaseConfig);
        this.doc = firebase.firestore().collection("marble").doc("test");
    }

    start(): void {
        cc.find("body1").zIndex = 1;
        cc.find("glass2").zIndex = 1;
        cc.find("rainbow").zIndex = 2;
        cc.find("body2").zIndex = 2;
        cc.find("Stick").zIndex = 3;
        cc.find("scenebg").zIndex = 4;
        cc.find("scene1").zIndex = 5;
        cc.find("scene2").zIndex = 5;
        cc.find("abort").zIndex = 6;
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

        this.doc.get().then((doc: firebase.firestore.DocumentData) => {
            if (doc.exists) {
                this.marbleList = doc.data().data;
                this.marbleList.forEach((marble: Marble, index: number) => {
                    (this.initMarble(marble) as any).index = index;
                })
            }
            else {
                let createdMarbles: cc.Node[] = [];
                this.marbleList.forEach((marble: Marble) => {
                    createdMarbles.push(this.initMarble(marble));
                })
                this.scheduleOnce((): void => {
                    this.marbleList = [];
                    createdMarbles.forEach((marble: cc.Node, index: number) => {
                        const name = marble.getComponent(cc.Sprite).spriteFrame?.name;
                        this.marbleList.push({
                            x: marble.x,
                            y: marble.y,
                            sprite: this.marbleSprites.map((sprite: cc.SpriteFrame) => { return sprite.name }).indexOf(name)
                        });
                        (createdMarbles[index] as any).index = this.marbleList.length - 1;
                    });
                    this.updateMarbleList();
                }, 2);
            }
        });
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
            }, 2);
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

    updateMarbleList(): void {
        this.doc.set({
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