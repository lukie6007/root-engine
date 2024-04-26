import { Component, Service } from "./base.js";
import { WorldInstance } from "./datatypes.js";

export class Project {
    constructor(public Name: string = "New Project", public Context: CanvasRenderingContext2D, public Settings: object = {}, public Services: Service[] = []) {
        this.Services.push(new RunService(this))
        this.Services.push(new World(this, Context))
    }


    GetService(targetservice: any): Service | undefined {
        return this.Services.find(service => service instanceof targetservice);
    }
}

//services
export class World extends Service {
    constructor(public Project: Project | null, public Context: CanvasRenderingContext2D) {
        super(Project)
        let RS = this.Project?.GetService(RunService) as RunService
        RS.OnUpdate(this.Render)
    }
    Render() {
        let render = this.Children.filter((child) => child instanceof WorldObject) as WorldObject[]
        render.forEach((WorldObj) => {
            console.log("drew: ", WorldObj)
            this.Context.drawImage(WorldObj.Sprite, WorldObj.WorldInstance.Position.x, WorldObj.WorldInstance.Position.y)
        })
    }
}

export class RunService extends Service {
    private Listeners: Function[] = [];

    constructor(public Project: Project | null) {
        super(Project);
        this.Advance = this.Advance.bind(this); // Binding Advance to the correct context
        requestAnimationFrame(this.Advance);
    }

    private Advance() {
        this.Listeners.forEach(func => {
            func.call(this);
        });
        requestAnimationFrame(this.Advance.bind(this)); // Binding Advance to the correct context
    }

    OnUpdate(func: Function) {
        if (!this.Listeners.includes(func)) {
            this.Listeners.push(func);
        }
    }
}

//components
export class WorldObject extends Component {
    WorldInstance: WorldInstance

    constructor(Service: Service, Name: string, public Sprite: HTMLImageElement) {
        super(Service, Name, null)
        this.WorldInstance = new WorldInstance()
    }
}
