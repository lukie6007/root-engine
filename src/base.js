export class Component {
    constructor(Service, Name, Parent = null, ID = 0) {
        this.Service = Service;
        this.Name = Name;
        this.Parent = Parent;
        this.ID = ID;
        Service === null || Service === void 0 ? void 0 : Service.Children.push(this);
    }
    Find(child) { var _a; return (_a = this.Service) === null || _a === void 0 ? void 0 : _a.Children.find(component => component.Name === child); }
    GetChildren() { var _a; return (_a = this.Service) === null || _a === void 0 ? void 0 : _a.Children.filter((child) => child.Parent == this); }
    Clone() { return Object.assign({}, this); }
    Destroy() {
        this.Parent = null;
        this.Service = null;
    }
}
export class Service {
    constructor(Project = null, Children = []) {
        this.Project = Project;
        this.Children = Children;
        Project === null || Project === void 0 ? void 0 : Project.Services.push(this);
    }
}
