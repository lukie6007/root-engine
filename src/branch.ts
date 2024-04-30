import { Component, Service } from "./base.js";
import { Listener, Mouse, Vector2, WorldInstance } from "./datatypes.js";

export class Project {
    constructor(public Name: string = "New Project", public Context: CanvasRenderingContext2D, public Settings: object = {}, public Services: Service[] = []) {
        new RunService(this)
        new World(this)
        new InputService(this, Context)
        new Renderer(this, Context)
    }


    GetService(targetServiceName: string): Service | undefined {
        return this.Services.find(service => service.constructor.name === targetServiceName);
    }
}

//services
export class RunService extends Service {
    private Listeners: Listener[] = [];
    private LastTime: number

    constructor(public Project: Project | null) {
        super(Project);
        this.Advance = this.Advance.bind(this); // Binding Advance to the correct context
        this.LastTime = performance.now()
        setInterval(this.Advance, 16.66);
    }

    private Advance() {
        let DeltaTime = performance.now() - this.LastTime
        this.LastTime = performance.now()
        this.Listeners.forEach(listener => {
            listener.Function.call(listener.Object, 1000 / DeltaTime)
        });
    }

    OnUpdate(list: Listener) {
        this.Listeners.push(list);
        console.log("Added: ", list)
    }
}

export class InputService extends Service {
    KeysDown: string[];
    Mouse: Mouse;

    constructor(Project: Project, public context: CanvasRenderingContext2D) {
        super(Project)
        this.Mouse = new Mouse();
        this.KeysDown = [];

        // Using arrow functions to maintain the correct context of "this"
        document.addEventListener("mousemove", (event) => this.getMouse(event));
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event)); // Add keyup event listener if needed
    }

    protected getMouse(event: MouseEvent) {
        let canvas = this.context.canvas;
        let scalar = new Vector2(canvas.width, canvas.height).divide(new Vector2(canvas.clientWidth, canvas.clientHeight))
        this.Mouse.Position = new Vector2(event.clientX, event.clientY).subtract(new Vector2(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top)).multiplyVector(scalar).subtract(new Vector2(canvas.width / 2, canvas.height / 2)).multiplyVector(new Vector2(1, -1))
    }

    protected handleKeyDown(event: KeyboardEvent) {
        const key = event.key;
        if (!this.KeysDown.includes(key)) {
            this.KeysDown.push(key);
        }

        event.preventDefault();
    }

    protected handleKeyUp(event: KeyboardEvent) {
        const key = event.key;
        const index = this.KeysDown.indexOf(key);
        if (index !== -1) {
            this.KeysDown.splice(index, 1);
        }
    }

    isKeyDown(key: string): boolean {
        return this.KeysDown.includes(key)
    }
}

export class Renderer extends Service {
    constructor(public Project: Project, public Context: CanvasRenderingContext2D) {
        super(Project)

        let RS = this.Project?.GetService("RunService") as RunService
        RS.OnUpdate(new Listener(this, this.Render))
    }

    Render() {
        let canvas = this.Context.canvas
        this.Context.clearRect(0, 0, canvas.width, canvas.height)
        let world = this.Project.GetService("World")

        //world objects
        let render: any = world?.Children.filter((child) => child instanceof WorldObject) as WorldObject[]
        render.forEach((obj: WorldObject) => {
            const drawImage = {
                position: obj.WorldInstance.Position.multiplyVector(new Vector2(1, -1)).add(new Vector2(canvas.width / 2, canvas.height / 2)).subtract(obj.WorldInstance.Size.multiplyScalar(0.5)),
                width: obj.WorldInstance.Size.x,
                height: obj.WorldInstance.Size.y,
                rotation: obj.WorldInstance.Rotation
            }

            // Save the current canvas state
            this.Context.save();

            // Translate to the center of the object
            this.Context.translate(drawImage.position.x + drawImage.width / 2, drawImage.position.y + drawImage.height / 2);

            // Rotate around the center of the object
            this.Context.rotate(drawImage.rotation);

            // Draw the rotated image
            this.Context.drawImage(obj.Sprite, -drawImage.width / 2, -drawImage.height / 2, drawImage.width, drawImage.height);

            // Restore the previous canvas state
            this.Context.restore();
        })

        //text
        render = world?.Children.filter((child) => child instanceof Text) as Text[]
        render.forEach((obj: Text) => {
            const drawImage = {
                position: obj.Position.multiplyVector(new Vector2(1, -1)).add(new Vector2(canvas.width / 2, canvas.height / 2))
            }


            this.Context.font = obj.Font
            this.Context.fillText(obj.Text, drawImage.position.x, drawImage.position.y)

        })
    }
}

export class World extends Service {
    constructor(public Project: Project | null) {
        super(Project)
    }
}

//components
export class WorldObject extends Component {
    WorldInstance: WorldInstance

    constructor(Service: Service, Name: string, public Sprite: HTMLImageElement) {
        super(Service, Name, null)
        this.WorldInstance = new WorldInstance()
        this.WorldInstance.Size = new Vector2(this.Sprite.width, this.Sprite.height)
    }
}

export class Text extends Component {
    constructor(Service: Service, Name: string, public Text: string = "", public Position: Vector2 = new Vector2(), public Font: string = "25pt Arial") {
        super(Service, Name)
    }
}

export class Actor extends WorldObject {
    constructor(Service: Service, Name: string, public Script: string = "") {
        super(Service, Name)
        this.RunScript()
    }

    public RunScript() {
        let func = new Function(this.Script)
        func.call(this)
    }
}