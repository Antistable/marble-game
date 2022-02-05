const { ccclass } = cc._decorator;
const { TOUCH_END } = cc.Node.EventType;

@ccclass
export default class Twitter extends cc.Component {

    turnUp: boolean = true;

    onLoad() {
        this.node.on(TOUCH_END, () => {
            cc.sys.openURL("https://twitter.com/intent/tweet?text=A marble game!&url=");
        }, this);

        this.schedule(() => {
            this.turnUp = !this.turnUp;
        }, 1)
    }

    update(dt) {
        this.node.rotation += this.turnUp ? dt * 36 : -dt * 36;

        this.node.x += dt * 200;
        if (this.node.x >= 650) {
            this.node.x = -100;
            this.node.y = Math.random() * 130 + 770;
        }
    }

}
