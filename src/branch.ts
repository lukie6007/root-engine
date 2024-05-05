import { Component, Service } from "./base.js";
import { Listener, Mouse, Vector2, WorldInstance } from "./datatypes.js";

export class Project {
    constructor(public Name: string = "New Project", public Context: CanvasRenderingContext2D, public Settings: object = {}, public Services: Service[] = [], public ID = 0) {
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
        console.info("RUNSERVICE: Added: ", list)
    }
}

export class InputService extends Service {
    Mouse: Mouse
    constructor(Project: Project, public context: CanvasRenderingContext2D, public KeysDown: string[] = []) {
        super(Project)
        this.Mouse = new Mouse()
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
    constructor(public Project: Project, public Context: CanvasRenderingContext2D, public Camera: Vector2 = new Vector2()) {
        super(Project)

        let RS = this.Project?.GetService("RunService") as RunService
        RS.OnUpdate(new Listener(this, this.Render))
    }

    Render() {
        const canvas = this.Context.canvas;
        const { width, height } = canvas; // Calculate canvas dimensions once
    
        // Batch transformations
        this.Context.clearRect(0, 0, width, height);
        this.Context.save();
    
        const world = this.Project.GetService("World");
        const renderObjects = world?.Children.filter(
            (child) => child instanceof WorldObject || child instanceof Text
        );
    
        renderObjects?.forEach((obj) => {
            if (obj instanceof WorldObject) {
                const { Position, Size, Rotation } = obj.WorldInstance;
                const drawImage = {
                    position: Position.multiplyVector(new Vector2(1, -1))
                        .add(new Vector2(width / 2, height / 2))
                        .subtract(Size.multiplyScalar(0.5)),
                    width: Size.x,
                    height: Size.y,
                    rotation: Rotation,
                };
    
                // Translate to the center of the object
                this.Context.translate(
                    drawImage.position.x + drawImage.width / 2,
                    drawImage.position.y + drawImage.height / 2
                );

                this.Context.translate(
                    -this.Camera.x,
                    this.Camera.y
                )
    
                // Rotate around the center of the object
                this.Context.rotate(drawImage.rotation);
    
                // Draw the rotated image
                this.Context.drawImage(
                    obj.Sprite,
                    -drawImage.width / 2,
                    -drawImage.height / 2,
                    drawImage.width,
                    drawImage.height
                );
            } else if (obj instanceof Text) {
                const { Position, Font, Text } = obj;
                const drawTextPosition = Position.multiplyVector(new Vector2(1, -1))
                    .add(new Vector2(width / 2, height / 2));
    
                this.Context.font = Font;
                this.Context.fillText(Text, drawTextPosition.x, drawTextPosition.y);
            }
        });
    
        // Restore the canvas state
        this.Context.restore();
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

    constructor(Service: Service, Name: string, public Sprite: HTMLImageElement = new Image()) {
        super(Service, Name, null)
        this.WorldInstance = new WorldInstance()
        this.WorldInstance.Size = new Vector2(this.Sprite.width, this.Sprite.height)
    }
}

export class Text extends Component {
    constructor(Service: Service, Name: string, public Text: string = "", public Position: Vector2 = new Vector2(), public Font: string = "25pt Arial") { super(Service, Name) }
}

export class Actor extends WorldObject {
    constructor(Service: Service, Name: string, Sprite: HTMLImageElement, public Script: string = "") {
        super(Service, Name, Sprite)
        this.RunScript()
    }

    public RunScript() {
        let func = new Function(this.Script)
        func.call(this)
    }
}