const { ccclass, property } = cc._decorator;
const { v2, audioEngine, director, macro, Label } = cc;
const { TOUCH_END } = cc.Node.EventType;

import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Marble from "./Marble";

interface MarbleProperty {
    x: number;
    y: number;
    sprite: number;
}

@ccclass
export default class Game extends cc.Component {

    @property(cc.AudioClip)
    music: cc.AudioClip = null;

    //States
    readonly Drag: number = 1;

    readonly DragOver: number = 2;

    readonly MoveStick: number = 3;

    readonly Launch: number = 4;

    readonly CreateMarbles: number = 5;

    readonly Wait: number = 6;

    State: number = this.Wait;


    @property(cc.Prefab)
    marblePrefab: cc.Prefab = null;

    @property([cc.SpriteFrame])
    marbleSprites: cc.SpriteFrame[] = new Array(8);

    currentMarble: cc.Node = null;

    marbleList: MarbleProperty[] = [{ x: 362, y: 386, sprite: 0 }, { x: 362, y: 386, sprite: 1 }, { x: 362, y: 386, sprite: 2 }, { x: 362, y: 386, sprite: 3 }, { x: 362, y: 386, sprite: 4 }, { x: 362, y: 386, sprite: 5 }, { x: 362, y: 386, sprite: 6 }, { x: 362, y: 386, sprite: 7 }];

    extraMarbleNum: number = 0;


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
        audioEngine.play(this.music, true, 1);
        macro.ENABLE_MULTI_TOUCH = false;
        director.getPhysicsManager().enabled = true;
        const firebaseConfig = {
            apiKey: "AIzaSyBP0Z9U6NtSzV_ew6aHGgeu0pOIfqiOJik",
            authDomain: "googlify-dev.firebaseapp.com",
            projectId: "googlify-dev",
            storageBucket: "googlify-dev.appspot.com",
            messagingSenderId: "579802640871",
            appId: "1:579802640871:web:6919d595e6f5bcd2d44d42"
        };
        this.app = firebase.initializeApp(firebaseConfig);
    }

    start(): void {
        if (new Date().getHours() < 18) {
            cc.find("fg2").destroy();
            cc.find("bg2").destroy();
            cc.find("tutorial2").destroy();
            cc.find("moon").destroy();
            cc.find("sun").on(TOUCH_END, (): void => {
                cc.sys.openURL("https://github.com/Antistable/marble-game");
            });
        }
        else {
            cc.find("bg").destroy();
            cc.find("sun").destroy();
            cc.find("tutorial").destroy();
            cc.find("moon").on(TOUCH_END, (): void => {
                cc.sys.openURL("https://github.com/Antistable/marble-game");
            });
        }
        cc.find("Twitter").zIndex = 1;
        cc.find("body1").zIndex = 1;
        cc.find("glass2").zIndex = 1;
        cc.find("rainbow").zIndex = 2;
        cc.find("body2").zIndex = 2;
        cc.find("marbleNum").zIndex = 3;
        cc.find("ExtraMarbleNum").zIndex = 3;
        cc.find("Stick").zIndex = 3;
        cc.find("scenebg").zIndex = 4;
        cc.find("scene1").zIndex = 5;
        cc.find("scene2").zIndex = 5;
        cc.find("Abort").zIndex = 6;
        cc.find("obstacle1").zIndex = 6;
        cc.find("glass1").zIndex = 98;

        //初始化场景障碍
        for (let index = 0; index < 8; index++) {
            this.initObstacle(504 - index * 50, 510);
        }
        for (let index = 0; index < 7; index++) {
            this.initObstacle(479 - index * 50, 550);
        }
        for (let index = 0; index < 8; index++) {
            this.initObstacle(504 - index * 50, 590);
        }
        for (let index = 0; index < 7; index++) {
            this.initObstacle(479 - index * 50, 630);
        }
        for (let index = 0; index < 8; index++) {
            this.lines[index] = this.initLine(504 - index * 50);
        }
        this.randomLines();

        const auth: firebase.auth.Auth = firebase.auth();
        auth.onAuthStateChanged((user: firebase.User) => {
            if (user) { // 已登入
                this.doc = firebase.firestore().collection("marble").doc(user.uid);
                this.doc.get().then((doc: firebase.firestore.DocumentData) => {
                    if (doc.exists) { // 已经有记录
                        this.marbleList = doc.data().data;
                        this.extraMarbleNum = doc.data().extra;
                        this.redrawText();
                        this.marbleList.forEach((marble: MarbleProperty, index: number) => {
                            this.initMarble(marble).getComponent(Marble).index = index;
                        })
                    }
                    else { // 新玩家
                        let createdMarbles: cc.Node[] = [];
                        this.marbleList.forEach((marble: MarbleProperty) => {
                            createdMarbles.push(this.initMarble(marble));
                        })
                        this.scheduleOnce((): void => {
                            this.marbleList = [];
                            this.updateMarbleList(createdMarbles); // 初始化marbleList
                        }, 2);
                    }
                });
            }
            else {
                cc.sys.openURL("../"); // 返回主页登入
            }
        });
    }

    initObstacle(x: number, y: number): void {
        const obstacle3: cc.Node = cc.instantiate(this.obstacle3Prefab);
        obstacle3.setPosition(v2(x, y));
        obstacle3.zIndex = 6;
        obstacle3.parent = director.getScene();
    }

    initLine(x: number): cc.Node {
        const line: cc.Node = cc.instantiate(this.linePrefab);
        line.setPosition(v2(x, 467));
        line.zIndex = 6;
        line.parent = director.getScene();
        return line;
    }

    randomLines(): void {
        this.greenLineNum = 0;
        for (let index = 0; index < 8; index++) {
            const isGreen: boolean = Boolean(Math.floor(Math.random() * 1.8));
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
        this.State = this.CreateMarbles;
        let createdMarbles: cc.Node[] = [];
        const marbleLineIndex: number = Math.floor((529 - marbleX) / 50);
        if (this.lines[marbleLineIndex]?.getComponent(cc.Sprite)?.spriteFrame?.name === this.greenLineSprite.name) /* 胜利 */ {
            for (let index = 0; index < (8 - this.greenLineNum) * 0.7; index++) {
                if (this.marbleList.length + createdMarbles.length < 80) {
                    createdMarbles.push(this.initMarble({ sprite: Math.floor(Math.random() * 8), x: 363, y: 386 }));
                }
                else {
                    this.extraMarbleNum++;
                }
            }
        }
        this.scheduleOnce((): void => {
            this.State = this.Wait;
            this.updateMarbleList(createdMarbles);
        }, 2);
        this.scheduleOnce(this.randomLines, 2);
    }

    initMarble(config: MarbleProperty): cc.Node {
        const marble: cc.Node = cc.instantiate(this.marblePrefab);
        marble.setPosition(v2(config.x, config.y));
        marble.getComponent(cc.Sprite).spriteFrame = this.marbleSprites[config.sprite];
        marble.parent = director.getScene();
        return marble;
    }

    updateFirestore(): void {
        this.doc.set({
            data: this.marbleList,
            extra: this.extraMarbleNum
        });
    }

    updateMarbleList(createdMarbles: cc.Node[]): void {
        createdMarbles.forEach((marble: cc.Node, index: number) => {
            this.marbleList.push({ // 记录刚创造的marble的位置和贴图
                x: marble.x,
                y: marble.y,
                sprite: this.marbleSprites.map((sprite: cc.SpriteFrame) => { return sprite.name }).indexOf(marble.getComponent(cc.Sprite).spriteFrame?.name)
            });
            createdMarbles[index].getComponent(Marble).index = this.marbleList.length - 1;
        });
        this.redrawText();
        this.updateFirestore();
    }

    redrawText(): void {
        cc.find("marbleNum").getComponent(Label).string = `${this.marbleList.length}`;
        cc.find("ExtraMarbleNum").getComponent(Label).string = `[+${this.extraMarbleNum}]`;
        if (this.marbleList.length < 80 && this.extraMarbleNum > 0) {
            cc.find("arrow").zIndex = 3;
            cc.find("mouse").zIndex = 3;
        }
        else {
            cc.find("arrow").zIndex = 0;
            cc.find("mouse").zIndex = 0;
        }
    }

    update(dt: number): void {
        if (this.State === this.CreateMarbles && this.currentMarble?.isValid) {
            this.currentMarble.opacity -= dt * 130; // 将落定的marble渐隐
            if (this.currentMarble.opacity <= 0) {
                this.currentMarble.destroy();
            }
        }
    }
}