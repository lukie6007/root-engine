import { Project } from "./base.ts";
import { RunService } from "./services.ts";

var main = new Project("Beta Project", {})
var runservice = main.GetService(RunService) as RunService

runservice.OnUpdate(() => {
    console.log("frame")
})