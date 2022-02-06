const { ccclass } = cc._decorator;
const { TOUCH_END } = cc.Node.EventType;

@ccclass
export default class Twitter extends cc.Component {

    turnUp: boolean = true;

    onLoad() {
        this.node.on(TOUCH_END, (): void => {
            cc.sys.openURL(`https://twitter.com/intent/tweet?text=Biubiubiu~%20A%20marble%20game!&url=${window.location.href}`);
        }, this);

        this.schedule((): void => {
            this.turnUp = !this.turnUp;
        }, 1);
    }

    update(dt: number) {
        this.node.angle += this.turnUp ? dt * 36 : -dt * 36;

        this.node.x += dt * 200;
        if (this.node.x >= 650) {
            this.node.x = -100;
            this.node.y = Math.random() * 130 + 770;
        }
    }

}