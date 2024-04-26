import { Project, RunService, WorldObject, World, InputService } from "./branch.js"
import { Listener } from "./datatypes.js"

let canvas = document.getElementById("main") as HTMLCanvasElement
let main = new Project("Beta Project", canvas.getContext("2d") as CanvasRenderingContext2D, {})
let runservice = main.GetService("RunService") as RunService
let inputservice = main.GetService("InputService") as InputService
let sprite = new Image()
sprite.src = "./src/Player.svg"
let player = new WorldObject(main.GetService("World") as World, "Player", sprite)

runservice.OnUpdate(new Listener({}, () => {
    player.WorldInstance.Position = inputservice.Mouse.Position
    if (inputservice.isKeyDown("ArrowRight")) {
        console.log("Hello World!")
    }
}))
