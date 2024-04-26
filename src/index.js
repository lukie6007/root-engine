import { Project, WorldObject } from "./branch.js";
import { Listener } from "./datatypes.js";
let canvas = document.getElementById("main");
let main = new Project("Beta Project", canvas.getContext("2d"), {});
let runservice = main.GetService("RunService");
let inputservice = main.GetService("InputService");
let sprite = new Image();
sprite.src = "./src/Player.svg";
let player = new WorldObject(main.GetService("World"), "Player", sprite);
runservice.OnUpdate(new Listener({}, () => {
    player.WorldInstance.Position = inputservice.Mouse.Position;
    if (inputservice.isKeyDown("ArrowRight")) {
        console.log("Hello World!");
    }
}));
