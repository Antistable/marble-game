import Game from "./Game";
const { ccclass } = cc._decorator;
const { TOUCH_END } = cc.Node.EventType;

@ccclass
export default class Extra extends cc.Component {

    Game: Game = null;

    onLoad() {
        this.node.on(TOUCH_END, this.createMarble, this);
        this.Game = cc.find("Game").getComponent(Game);
    }

    createMarble() {
        if (this.Game.State == this.Game.Wait && this.Game.marbleList.length < 50 && this.Game.extraMarbleNum > 0) {
            this.Game.extraMarbleNum--;
            this.Game.State = this.Game.CreateMarbles;
            let createdMarbles = [];
            createdMarbles.push(this.Game.initMarble({ sprite: Math.floor(Math.random() * 8), x: 363, y: 386 }));
            this.scheduleOnce(() => {
                this.Game.updateMarbleList(createdMarbles);
                this.Game.State = this.Game.Wait;
            }, 1);
        }
    }

}
