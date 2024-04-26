export class Component {
    constructor(Service, Name, Parent = null, ID = 0) {
        this.Service = Service;
        this.Name = Name;
        this.Parent = Parent;
        this.ID = ID;
        Service === null || Service === void 0 ? void 0 : Service.Children.push(this);
    }
    Find(child) {
        var _a;
        return (_a = this.Service) === null || _a === void 0 ? void 0 : _a.Children.find(component => component.Name === child);
    }
    Clone() {
        // Create a new instance of Component with the same properties
        return Object.assign({}, this);
    }
    Destroy() {
        this.Parent = null;
        this.Service = null;
    }
}
export class Service {
    constructor(Project = null, Children = []) {
        this.Project = Project;
        this.Children = Children;
    }
}
