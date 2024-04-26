import { Component, Service } from "./base.js";
import { WorldInstance } from "./datatypes.js";
export class Project {
    Name;
    Context;
    Settings;
    Services;
    constructor(Name = "New Project", Context, Settings = {}, Services = []) {
        this.Name = Name;
        this.Context = Context;
        this.Settings = Settings;
        this.Services = Services;
        this.Services.push(new RunService(this));
        this.Services.push(new World(this, Context));
    }
    GetService(targetservice) {
        return this.Services.find(service => service instanceof targetservice);
    }
}
//services
export class World extends Service {
    Project;
    Context;
    constructor(Project, Context) {
        super(Project);
        this.Project = Project;
        this.Context = Context;
        let RS = this.Project?.GetService(RunService);
        RS.OnUpdate(this.Render);
    }
    Render() {
        let render = this.Children.filter((child) => child instanceof WorldObject);
        render.forEach((WorldObj) => {
            console.log("drew: ", WorldObj);
            this.Context.drawImage(WorldObj.Sprite, WorldObj.WorldInstance.Position.x, WorldObj.WorldInstance.Position.y);
        });
    }
}
export class RunService extends Service {
    Project;
    Listeners = [];
    constructor(Project) {
        super(Project);
        this.Project = Project;
        this.Advance = this.Advance.bind(this); // Binding Advance to the correct context
        requestAnimationFrame(this.Advance);
    }
    Advance() {
        this.Listeners.forEach(func => {
            func.call(this);
        });
        requestAnimationFrame(this.Advance.bind(this)); // Binding Advance to the correct context
    }
    OnUpdate(func) {
        if (!this.Listeners.includes(func)) {
            this.Listeners.push(func);
        }
    }
}
//components
export class WorldObject extends Component {
    Sprite;
    WorldInstance;
    constructor(Service, Name, Sprite) {
        super(Service, Name, null);
        this.Sprite = Sprite;
        this.WorldInstance = new WorldInstance();
    }
}
