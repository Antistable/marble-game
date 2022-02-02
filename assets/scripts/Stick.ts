import Game from "./Game";
const { ccclass, property } = cc._decorator;
const { v2, RigidBody } = cc;
const { TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL } = cc.Node.EventType;

@ccclass
export default class Stick extends cc.Component {

    originalMouseY: number = 0;
    originalNodeY: number = 0;

    onLoad(): void {
        this.node.on(TOUCH_START, this.ifClick, this);
        this.node.on(TOUCH_MOVE, this.move, this);
        this.node.on(TOUCH_END, this.launch, this);
        this.node.on(TOUCH_CANCEL, this.launch, this);
    }

    ifClick(event: cc.Touch): void {
        if (Game.State == Game.FinishDraggingMarble) {
            this.originalNodeY = this.node.y;
            this.originalMouseY = event.getLocation().y;
            const distance: number = event.getLocation().sub(v2(this.node.x - 2, this.node.y - 75)).mag();
            if (distance < 15) {
                Game.State = Game.MovingStick;
            }
        }
    }

    move(event: cc.Touch): void {
        const isOn: boolean = Game.State == Game.MovingStick;
        if (isOn) {
            const dy: number = this.originalMouseY - event.getLocation().y;
            this.node.y = this.originalNodeY - (dy > 100 ? 100 : (dy < 0 ? 0 : dy)); 
            //this.node.y ∈ [this.originalNodeY - 100, this.originalNodeY]
        }
    }

    launch(event: cc.Touch): void {
        const isOn: boolean = Game.State == Game.MovingStick;
        if (isOn) {
            const dy: number = this.originalMouseY - event.getLocation().y;
            if (dy <= 0) {
                this.node.y = this.originalNodeY;
                Game.State = Game.MovingStick;
            }
            else {
                Game.currentMarble.getComponent(RigidBody).applyLinearImpulse(v2(0, (dy > 100 ? 100 : dy) * 8 + 488), v2(this.node.position.x, this.node.position.y), true);
                this.node.y = this.originalNodeY;
                Game.State = Game.LaunchingMarble;
            }
        }
    }
}
