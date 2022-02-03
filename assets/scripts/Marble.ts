import Game from "./Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Marble extends cc.Component {

    marbleSpriteIndex: number = 0;

    Game: Game = null;

    onLoad(): void {
        cc.director.getPhysicsManager().enabled = true;
    }

    start(): void {
        this.Game = cc.find("Game").getComponent(Game);
        this.Game.currentMarble = this.node;
        this.node.zIndex = 6;
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.name === "scene2" && this.Game.State === this.Game.Launch) {
            this.Game.settle(this.node.position.x);
        }
    }
}