import { Project, RunService, WorldObject, World } from "./branch.js"

let canvas = document.getElementById("main") as HTMLCanvasElement
let main = new Project("Beta Project", canvas.getContext("2d") as CanvasRenderingContext2D, {})
let runservice = main.GetService(RunService) as RunService
let sprite = new Image()
sprite.src = "./src/Player.svg"
let player = new WorldObject(main.GetService(World) as World, "Player", sprite)

