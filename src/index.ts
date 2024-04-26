import { RunService, World, Project, WorldObject } from "./base.js";

let canvas = document.getElementById("main") as HTMLCanvasElement
var main = new Project("Beta Project", canvas.getContext("2d") as CanvasRenderingContext2D, {})
var runservice = main.GetService(RunService) as RunService
var sprite = new Image()
sprite.src = "./src/Player.svg"
var player = new WorldObject(main.GetService(World) as World, "Player", sprite)

runservice.OnUpdate(() => {
    console.log("test")
})