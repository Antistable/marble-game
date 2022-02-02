const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    obstacle3Prefab: cc.Prefab = null;

    static currentMarble: cc.Node = null;

    static readonly FinishDraggingMarble: number = 2;

    static readonly MovingStick: number = 3;

    static readonly LaunchingMarble: number = 4;

    static State: number = Game.FinishDraggingMarble;

    start(): void {
        cc.find("glass1").zIndex = 99;
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
    }

    initObstacle(x: number, y: number): void {
        const obstacle3: cc.Node = cc.instantiate(this.obstacle3Prefab);
        obstacle3.setPosition(cc.v2(x, y));
        obstacle3.zIndex = 6;
        obstacle3.parent = cc.director.getScene();
    }
}
