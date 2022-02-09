const { ccclass } = cc._decorator;
const { TOUCH_END } = cc.Node.EventType;
import Game from "./Game";

import "firebase/firestore";

@ccclass
export default class NewClass extends cc.Component {

    clickTime: number = 0;

    Game: Game;

    start(): void {
        this.Game = cc.find("Game").getComponent(Game);
        this.node.on(TOUCH_END, this.click, this);
    }

    click(): void {
        this.node.opacity += 63; // 66 + 63 * 3 === 255
        if (++this.clickTime === 3) {
            this.Game.doc.delete().then((): void => { location.reload(); });
        }
    }

}
