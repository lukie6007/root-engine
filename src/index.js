import { Project, RunService, WorldObject, World } from "./branch.js";
let canvas = document.getElementById("main");
let main = new Project("Beta Project", canvas.getContext("2d"), {});
var runservice = main.GetService(RunService);
var sprite = new Image();
sprite.src = "./src/Player.svg";
var player = new WorldObject(main.GetService(World), "Player", sprite);
