export class Component {
    Service;
    Name;
    Parent;
    ID;
    constructor(Service, Name, Parent, ID) {
        this.Service = Service;
        this.Name = Name;
        this.Parent = Parent;
        this.ID = ID;
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
export class Project {
    Name;
    Settings;
    Services;
    constructor(Name = "New Project", Settings = {}, Services = []) {
        this.Name = Name;
        this.Settings = Settings;
        this.Services = Services;
    }
    GetService(targetservice) {
        return this.Services.find(service => service instanceof targetservice);
    }
}
