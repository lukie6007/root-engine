import { Component, Service } from "./base.js";
import { Listener, Mouse, Vector2, WorldInstance } from "./datatypes.js";
export class Project {
    constructor(Name = "New Project", Context, Settings = {}, Services = []) {
        this.Name = Name;
        this.Context = Context;
        this.Settings = Settings;
        this.Services = Services;
        this.Services.push(new RunService(this));
        this.Services.push(new World(this));
        this.Services.push(new InputService(Context));
        this.Services.push(new Renderer(this, Context));
    }
    GetService(targetServiceName) {
        return this.Services.find(service => service.constructor.name === targetServiceName);
    }
}
//services
export class RunService extends Service {
    constructor(Project) {
        super(Project);
        this.Project = Project;
        this.Listeners = [];
        this.Advance = this.Advance.bind(this); // Binding Advance to the correct context
        this.LastTime = performance.now();
        setInterval(this.Advance, 16.66);
    }
    Advance() {
        let DeltaTime = performance.now() - this.LastTime;
        this.LastTime = performance.now();
        this.Listeners.forEach(listener => {
            listener.Function.call(listener.Object, 1000 / DeltaTime);
        });
    }
    OnUpdate(list) {
        this.Listeners.push(list);
        console.log("Added: ", list);
    }
}
export class InputService extends Service {
    constructor(context) {
        super();
        this.context = context;
        this.Mouse = new Mouse();
        this.KeysDown = [];
        // Using arrow functions to maintain the correct context of "this"
        document.addEventListener("mousemove", (event) => this.getMouse(event));
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event)); // Add keyup event listener if needed
    }
    getMouse(event) {
        let canvas = this.context.canvas;
        let scalar = new Vector2(canvas.width, canvas.height).divide(new Vector2(canvas.clientWidth, canvas.clientHeight));
        this.Mouse.Position = new Vector2(event.clientX, event.clientY).subtract(new Vector2(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top)).multiplyVector(scalar).subtract(new Vector2(canvas.width / 2, canvas.height / 2)).multiplyVector(new Vector2(1, -1));
    }
    handleKeyDown(event) {
        const key = event.key;
        if (!this.KeysDown.includes(key)) {
            this.KeysDown.push(key);
        }
        event.preventDefault();
    }
    handleKeyUp(event) {
        const key = event.key;
        const index = this.KeysDown.indexOf(key);
        if (index !== -1) {
            this.KeysDown.splice(index, 1);
        }
    }
    isKeyDown(key) {
        //console.log(this.KeysDown)
        return this.KeysDown.includes(key);
    }
}
export class Renderer extends Service {
    constructor(Project, Context) {
        var _a;
        super(Project);
        this.Project = Project;
        this.Context = Context;
        let RS = (_a = this.Project) === null || _a === void 0 ? void 0 : _a.GetService("RunService");
        RS.OnUpdate(new Listener(this, this.Render));
    }
    Render() {
        let canvas = this.Context.canvas;
        this.Context.clearRect(0, 0, canvas.width, canvas.height);
        let world = this.Project.GetService("World");
        //world objects
        let render = world === null || world === void 0 ? void 0 : world.Children.filter((child) => child instanceof WorldObject);
        render.forEach((obj) => {
            const drawImage = {
                position: obj.WorldInstance.Position.multiplyVector(new Vector2(1, -1)).add(new Vector2(canvas.width / 2, canvas.height / 2)).subtract(obj.WorldInstance.Size.multiplyScalar(0.5))
            };
            this.Context.drawImage(obj.Sprite, drawImage.position.x, drawImage.position.y);
        });
        //text
        render = world === null || world === void 0 ? void 0 : world.Children.filter((child) => child instanceof Text);
        render.forEach((obj) => {
            const drawImage = {
                position: obj.Position.multiplyVector(new Vector2(1, -1)).add(new Vector2(canvas.width / 2, canvas.height / 2))
            };
            this.Context.font = obj.Font;
            this.Context.fillText(obj.Text, drawImage.position.x, drawImage.position.y);
        });
    }
}
export class World extends Service {
    constructor(Project) {
        super(Project);
        this.Project = Project;
    }
}
//components
export class WorldObject extends Component {
    constructor(Service, Name, Sprite) {
        super(Service, Name, null);
        this.Sprite = Sprite;
        this.WorldInstance = new WorldInstance();
        this.WorldInstance.Size = new Vector2(this.Sprite.width, this.Sprite.height);
    }
}
export class Text extends Component {
    constructor(Service, Name, Text = "", Position = new Vector2(), Font = "25pt Arial") {
        super(Service, Name);
        this.Text = Text;
        this.Position = Position;
        this.Font = Font;
    }
}
