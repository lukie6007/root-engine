import { Component, Project } from "./base.ts";

export class Service { constructor(public Project: Project | null = null, public Children: Component[] = []) { } }

export class World extends Service {
    constructor(public Project: Project | null, public Context: CanvasRenderingContext2D) { super(Project) }
    Render() { }
}

export class RunService extends Service {
    constructor(public Project: Project | null, private Listeners: Function[]) {
        super(Project)
        this.Advance()
    }

    private Advance() {
        this.Listeners.forEach((func) => {
            func.call(this)
        })
        requestAnimationFrame(this.Advance)
    }

    OnUpdate(func: Function) {
        if (!(this.Listeners.includes(func))) {
            this.Listeners.push(func)
        }
    }
}