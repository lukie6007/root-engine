import { Project, RunService, WorldObject, World, InputService, Text } from "./branch.js"
import { Listener, Vector2 } from "./datatypes.js"

let canvas = document.getElementById("main") as HTMLCanvasElement
let main = new Project("Beta Project", canvas.getContext("2d") as CanvasRenderingContext2D, {})
let runservice = main.GetService("RunService") as RunService
let inputservice = main.GetService("InputService") as InputService
let sprite = new Image()
sprite.src = "./src/Player.svg"
let player = new WorldObject(main.GetService("World") as World, "Player", sprite)
let text = new Text(main.GetService("World") as World, "test", "test", new Vector2(-600, 300))
console.log(main.GetService("World"))

runservice.OnUpdate(new Listener({}, (fps: number) => {
    player.WorldInstance.Position = inputservice.Mouse.Position
    if (inputservice.isKeyDown("ArrowRight")) {
        console.log("Hello World!")
    }

    text.Text = "FPS: " + Math.round(fps).toString()
}))
