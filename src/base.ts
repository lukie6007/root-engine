import { Project } from "./branch.js";

export class Component {
    constructor(public Service: Service | null, public Name: string, public Parent: Component | null = null, public ID: number = 0) { }

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

export class Service { constructor(public Project: Project | null = null, public Children: Component[] = []) { } }