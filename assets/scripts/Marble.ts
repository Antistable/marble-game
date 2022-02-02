import { initializeApp } from "firebase/app"
import Game from "./Game";
const { ccclass } = cc._decorator;

@ccclass
export default class Marble extends cc.Component {

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
        Game.currentMarble = this.node;
    }

    update(): void {
    }
}