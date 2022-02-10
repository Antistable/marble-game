const { TOUCH_END } = cc.Node.EventType;
const { ccclass } = cc._decorator;
import Game from "./Game";

@ccclass
export default class NewClass extends cc.Component {

    Game: Game = null;

    rotate: boolean = false;

    onLoad(): void {
        this.Game = cc.find("Game").getComponent(Game);

        this.node.on(TOUCH_END, (): void => {
            if (this.Game.State === this.Game.Launch) {
                this.Game.currentMarble.destroy();
                this.Game.State = this.Game.Wait;
                this.Game.updateFirestore();
                this.Game.randomLines();
                this.rotate = true;
                this.scheduleOnce((): void => {
                    this.rotate = false;
                }, 1)
            }
        });
    }

    update(dt: number): void {
        if (this.rotate) {
            this.node.angle += dt * 120;
        }
    }

}