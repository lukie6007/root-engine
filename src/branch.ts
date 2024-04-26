import { Component, Service } from "./base.js";
import { Listener, Mouse, Vector2, WorldInstance } from "./datatypes.js";

export class Project {
    constructor(public Name: string = "New Project", public Context: CanvasRenderingContext2D, public Settings: object = {}, public Services: Service[] = []) {
        this.Services.push(new RunService(this))
        this.Services.push(new World(this, Context))
        this.Services.push(new InputService(Context))
    }


    GetService(targetServiceName: string): Service | undefined {
        return this.Services.find(service => service.constructor.name === targetServiceName);
    }
}

//services
export class RunService extends Service {
    private Listeners: Listener[] = [];

    constructor(public Project: Project | null) {
        super(Project);
        this.Advance = this.Advance.bind(this); // Binding Advance to the correct context
        requestAnimationFrame(this.Advance);
    }

    private Advance() {
        this.Listeners.forEach(listener => {
            listener.Function.call(listener.Object)
        });
        requestAnimationFrame(this.Advance.bind(this)); // Binding Advance to the correct context
    }

    OnUpdate(list: Listener) {
        this.Listeners.push(list);
        console.log("Added: ", list)
    }
}

export class InputService extends Service {
    private KeysDown: string[];
    Mouse: Mouse;

    constructor(public context: CanvasRenderingContext2D) {
        super()
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
        this.Mouse.Position = new Vector2(event.clientX, event.clientY).multiplyVector(scalar).subtract(new Vector2(canvas.width / 2, canvas.height / 2))
    }

    handleKeyDown(event: KeyboardEvent) {
        const key = event.key;
        if (!this.KeysDown.includes(key)) {
            this.KeysDown.push(key);
        }

        event.preventDefault();
    }

    handleKeyUp(event: KeyboardEvent) {
        const key = event.key;
        const index = this.KeysDown.indexOf(key);
        if (index !== -1) {
            this.KeysDown.splice(index, 1);
        }
    }

    isKeyDown(key: string): boolean {
        //console.log(this.KeysDown)
        return this.KeysDown.includes(key)
    }
}

export class World extends Service {
    constructor(public Project: Project | null, public Context: CanvasRenderingContext2D) {
        super(Project)
        let RS = this.Project?.GetService("RunService") as RunService
        RS.OnUpdate(new Listener(this, this.Render))
    }

    Render() {
        let canvas = this.Context.canvas
        this.Context.clearRect(0, 0, canvas.width, canvas.height)
        let render = this.Children.filter((child) => child instanceof WorldObject) as WorldObject[]
        render.forEach((obj) => {
            const drawImage = {
                position: obj.WorldInstance.Position.add(new Vector2(canvas.width / 2, canvas.height / 2)).subtract(obj.WorldInstance.Size.multiplyScalar(0.5))
            }

            this.Context.drawImage(obj.Sprite, drawImage.position.x, drawImage.position.y)
        })
    }
}

//components
export class WorldObject extends Component {
    WorldInstance: WorldInstance

    constructor(Service: Service, Name: string, public Sprite: HTMLImageElement) {
        super(Service, Name, null)
        this.WorldInstance = new WorldInstance()
        this.WorldInstance.Size = new Vector2(this.Sprite.width, this.Sprite.height)
        Service.Children.push(this)
    }
}
