import Game from "./Game";
const { v2, RigidBody } = cc;
const { ccclass } = cc._decorator;
const { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType;

@ccclass
export default class Marble extends cc.Component {

    marbleSpriteIndex: number = 0;

    Game: Game = null;

    positionBeforeDrag: cc.Vec3 = null;

    index: number = -1;

    start(): void {
        this.Game = cc.find("Game").getComponent(Game);
        this.node.zIndex = 0;
        this.node.on(TOUCH_START, this.dragStart, this);
    }

    dragStart() {
        if (this.Game.State === this.Game.Wait) {
            this.positionBeforeDrag = this.node.position;
            this.Game.State = this.Game.Drag;
            this.node.zIndex = 99;
            this.getComponent(RigidBody).active = false;
            this.Game.currentMarble = this.node;
            this.node.on(TOUCH_MOVE, this.drag, this);
            this.node.on(TOUCH_END, this.dragOver, this);
            this.node.on(TOUCH_CANCEL, this.dragOver, this);
        }
    }

    drag(event: cc.Touch) {
        if (this.Game.State === this.Game.Drag) {
            this.node.setPosition(event.getLocation()); // 保持在鼠标位置
        }
    }

    dragOver(event: cc.Touch) {
        if (this.Game.State === this.Game.Drag) {
            if (event.getLocation().sub(v2(558, 598)).mag() < 15) {
                this.node.zIndex = 6;
                this.Game.State = this.Game.DragOver;
                this.getComponent(RigidBody).active = true;
            }
            else {
                this.node.position = this.positionBeforeDrag;
                this.Game.State = this.Game.Wait;
                this.node.zIndex = 0;
                this.getComponent(RigidBody).active = true;
                this.Game.currentMarble = null;
                this.Game.State = this.Game.Wait;
            }
        }
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.name === "scene2" && this.Game.State === this.Game.Launch) {
            this.Game.settle(this.node.x);
        }
    }

}