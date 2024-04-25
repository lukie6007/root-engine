export class Service {
    Project;
    Children;
    constructor(Project = null, Children = []) {
        this.Project = Project;
        this.Children = Children;
    }
}
export class World extends Service {
    Project;
    Context;
    constructor(Project, Context) {
        super(Project);
        this.Project = Project;
        this.Context = Context;
    }
    Render() { }
}
export class RunService extends Service {
    Project;
    Listeners;
    constructor(Project, Listeners) {
        super(Project);
        this.Project = Project;
        this.Listeners = Listeners;
        this.Advance();
    }
    Advance() {
        this.Listeners.forEach((func) => {
            func.call(this);
        });
        requestAnimationFrame(this.Advance);
    }
    OnUpdate(func) {
        if (!(this.Listeners.includes(func))) {
            this.Listeners.push(func);
        }
    }
}
