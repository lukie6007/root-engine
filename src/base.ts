import { Project } from "./branch.js";

export class Component {
    constructor(public Service: Service | null, public Name: string, public Parent: Component | null = null, public ID: number = 0) { Service?.Children.push(this) }

    Find(child: string): Component | undefined {
        return this.Service?.Children.find(component => component.Name === child);
    }

    GetChildren() {
        let out: Component[] = []
        this.Service?.Children.forEach((child) => {
            if (child.Parent == this) {
                out.push(child)
            }
        })
        return out
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

export class Service { constructor(public Project: Project | null = null, public Children: Component[] = []) { Project?.Services.push(this) } }