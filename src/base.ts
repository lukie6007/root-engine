import { RunService, Service, World } from "./services";

export class Component {
    constructor(public Service: Service | null, public Name: string, public Parent: Component | null, public ID: number) { }

    Find(child: string): Component | undefined {
        return this.Service?.Children.find(component => component.Name === child);
    }

    Clone(): Component {
        // Create a new instance of Component with the same properties
        return { ...this }
    }

    Destroy() {
        this.Parent = null
        this.Service = null
    }
}

export class Project {
    constructor(public Name: string = "New Project", public Settings: object = {}, public Services: Service[] = []) {
        this.NewService(RunService)
        this.NewService(World)
    }

    private NewService(service: any) {
        this.Services.push(new service)
    }

    GetService(targetservice: any): Service | undefined {
        return this.Services.find(service => service instanceof targetservice);
    }
}