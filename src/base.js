import { CollisionShape, Vector2 } from "./datatypes.js";
export class Component {
    Service;
    Name;
    Parent;
    ID;
    constructor(Service, Name, Parent = null, ID = 0) {
        this.Service = Service;
        this.Name = Name;
        this.Parent = Parent;
        this.ID = ID;
    }
    Find(child) {
        return this.Service?.Children.find(component => component.Name === child);
    }
    Clone() {
        // Create a new instance of Component with the same properties
        return { ...this };
    }
    Destroy() {
        this.Parent = null;
        this.Service = null;
    }
}
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
export class Service {
    Project;
    Children;
    constructor(Project = null, Children = []) {
        this.Project = Project;
        this.Children = Children;
    }
}
export class WorldInstance {
    Position;
    Size;
    CollisionSize;
    CollisionShape;
    constructor(Position = new Vector2(), Size = new Vector2(), CollisionSize = new Vector2()) {
        this.Position = Position;
        this.Size = Size;
        this.CollisionSize = CollisionSize;
        this.CollisionShape = CollisionShape.Rectangle;
    }
}
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
