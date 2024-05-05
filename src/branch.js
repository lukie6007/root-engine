import { Component, Service } from "./base.js";
import { Listener, Mouse, Vector2, WorldInstance } from "./datatypes.js";
export class Project {
    constructor(Name = "New Project", Context, Settings = {}, Services = [], ID = 0) {
        this.Name = Name;
        this.Context = Context;
        this.Settings = Settings;
        this.Services = Services;
        this.ID = ID;
        new RunService(this);
        new World(this);
        new InputService(this, Context);
        new Renderer(this, Context);
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
        console.info("RUNSERVICE: Added: ", list);
    }
}
export class InputService extends Service {
    constructor(Project, context, KeysDown = []) {
        super(Project);
        this.context = context;
        this.KeysDown = KeysDown;
        this.Mouse = new Mouse();
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
        //event.preventDefault();
    }
    handleKeyUp(event) {
        const key = event.key;
        const index = this.KeysDown.indexOf(key);
        if (index !== -1) {
            this.KeysDown.splice(index, 1);
        }
    }
    isKeyDown(key) {
        return this.KeysDown.includes(key);
    }
}
export class Renderer extends Service {
    constructor(Project, Context, Camera = new Vector2()) {
        var _a;
        super(Project);
        this.Project = Project;
        this.Context = Context;
        this.Camera = Camera;
        let RS = (_a = this.Project) === null || _a === void 0 ? void 0 : _a.GetService("RunService");
        RS.OnUpdate(new Listener(this, this.render));
    }
    render() {
        const canvas = this.Context.canvas;
        const { width, height } = canvas; // Calculate canvas dimensions once
        // Batch transformations
        this.Context.clearRect(0, 0, width, height);
        this.Context.save();
        const world = this.Project.GetService("World");
        const renderObjects = world === null || world === void 0 ? void 0 : world.Children.filter((child) => child instanceof WorldObject || child instanceof Text || child instanceof Selection);
        renderObjects === null || renderObjects === void 0 ? void 0 : renderObjects.forEach((obj) => {
            if (obj instanceof WorldObject) {
                this.renderWorldObject(obj, width, height);
            }
            else if (obj instanceof Text) {
                this.renderText(obj, width, height);
            }
            else if (obj instanceof Selection) {
                this.renderSelection(obj, width, height);
            }
        });
        // Restore the canvas state
        this.Context.restore();
    }
    renderWorldObject(obj, width, height) {
        const { Position, Size, Rotation } = obj.WorldInstance;
        const drawImage = {
            position: Position.multiplyVector(new Vector2(1, -1))
                .add(new Vector2(width / 2, height / 2))
                .subtract(Size.multiplyScalar(0.5)),
            width: Size.x,
            height: Size.y,
            rotation: Rotation,
        };
        this.Context.translate(drawImage.position.x + drawImage.width / 2, drawImage.position.y + drawImage.height / 2);
        // camera
        this.Context.translate(-this.Camera.x, -this.Camera.y);
        this.Context.rotate(drawImage.rotation);
        this.Context.drawImage(obj.Sprite, -drawImage.width / 2, -drawImage.height / 2, drawImage.width, drawImage.height);
    }
    renderText(obj, width, height) {
        const { Position, Font, Text } = obj;
        const drawTextPosition = Position.multiplyVector(new Vector2(1, -1))
            .add(new Vector2(width / 2, height / 2));
        this.Context.font = Font;
        this.Context.fillText(Text, drawTextPosition.x, drawTextPosition.y);
    }
    renderSelection(obj, width, height) {
        const adornee = obj.Adornee;
        const { Position, Size, Rotation } = adornee.WorldInstance;
        const drawImage = {
            position: Position.multiplyVector(new Vector2(1, -1))
                .add(new Vector2(width / 2, height / 2))
                .subtract(Size.multiplyScalar(0.5)),
            width: Size.x,
            height: Size.y,
            rotation: Rotation,
        };
        this.Context.translate(drawImage.position.x + drawImage.width / 2, drawImage.position.y + drawImage.height / 2);
        // camera
        this.Context.translate(-this.Camera.x, -this.Camera.y);
        this.Context.rotate(drawImage.rotation);
        this.Context.drawImage(adornee.Sprite, -drawImage.width / 2, -drawImage.height / 2, drawImage.width, drawImage.height);
        this.Context.strokeStyle = "blue";
        this.Context.strokeRect(-drawImage.width / 2, -drawImage.height / 2, drawImage.width, drawImage.height);
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
    constructor(Service, Name, Sprite = new Image()) {
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
export class Selection extends Component {
    constructor(Service, Name, Adornee) {
        super(Service, Name);
        this.Adornee = Adornee;
    }
}
export class Actor extends WorldObject {
    constructor(Service, Name, Sprite, Script = "") {
        super(Service, Name, Sprite);
        this.Script = Script;
        this.RunScript();
    }
    RunScript() {
        let func = new Function(this.Script);
        func.call(this);
    }
}
