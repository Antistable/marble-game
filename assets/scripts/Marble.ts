import { initializeApp } from "firebase/app"
import Game from "./Game";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Marble extends cc.Component {

    @property(cc.Node)
    GameNode: cc.Node = null;

    Game: Game = null;

    onLoad(): void {
        const firebaseConfig = {
            apiKey: "AIzaSyD19zLX_Ra7lBPHkUj5GydBqmgPN4g3DYY",
            authDomain: "githubpagesblog.firebaseapp.com",
            databaseURL: "https://githubpagesblog-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "githubpagesblog",
            storageBucket: "githubpagesblog.appspot.com",
            messagingSenderId: "867990286502",
            appId: "1:867990286502:web:6d5a0bac07cd0a975a4467",
            measurementId: "G-Y9FZSH1QZC"
        };
        const app = initializeApp(firebaseConfig);
        cc.director.getPhysicsManager().enabled = true;
    }

    start(): void {
        this.Game = this.GameNode.getComponent(Game);
        this.Game.currentMarble = this.node;
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider): void {
        if (otherCollider.node.name === "scene2" && this.Game.State === this.Game.Launch) {
            this.Game.settle(this.node.position.x);
        }
    }
}