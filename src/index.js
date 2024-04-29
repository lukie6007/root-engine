import { Project, WorldObject, Text } from "./branch.js";
import { Listener, Vector2 } from "./datatypes.js";
let canvas = document.getElementById("main");
let main = new Project("Beta Project", canvas.getContext("2d"), {});
let runservice = main.GetService("RunService");
let inputservice = main.GetService("InputService");
let sprite = new Image();
sprite.src = "./src/Player.svg";
let player = new WorldObject(main.GetService("World"), "Player", sprite);
let text = new Text(main.GetService("World"), "test", "test", new Vector2(-600, 300));
console.log(main.GetService("World"));
runservice.OnUpdate(new Listener({}, (fps) => {
    player.WorldInstance.Position = inputservice.Mouse.Position;
    if (inputservice.isKeyDown("ArrowRight")) {
        console.log("Hello World!");
    }
    player.WorldInstance.Rotation += 0.1;
    text.Text = "FPS: " + Math.round(fps).toString();
}));
