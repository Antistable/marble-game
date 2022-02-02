const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    static currentMarble: cc.Node = null;

    static readonly FinishDraggingMarble: number = 2;

    static readonly MovingStick: number = 3;

    static readonly LaunchingMarble: number = 4;

    static State: number = Game.FinishDraggingMarble;
}
