export class Component {
    Service;
    Name;
    Parent;
    ID;
    constructor(Service, Name, Parent = null, ID = 0) {
        this.Service = Service;
        this.Name = Name;
        this.Parent = Parent;
        this.ID = ID;
        Service?.Children.push(this);
    }
    Find(child) {
        return this.Service?.Children.find(component => component.Name === child);
    }
    Clone() {
        // Create a new instance of Component with the same properties
        return { ...this };
    }
    Destroy() {
        this.Parent = null;
        this.Service = null;
    }
}
export class Service {
    Project;
    Children;
    constructor(Project = null, Children = []) {
        this.Project = Project;
        this.Children = Children;
    }
}
