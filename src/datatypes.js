export class Vector2 {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);
    normalize = () => this.multiplyScalar(1 / this.magnitude());
    dot = (other) => this.x * other.x + this.y * other.y;
    angleBetween = (other) => Math.acos(this.dot(other) / (this.magnitude() * other.magnitude()));
    add = (other) => new Vector2(this.x + other.x, this.y + other.y);
    subtract = (other) => new Vector2(this.x - other.x, this.y - other.y);
    divide = (other) => new Vector2(this.x / other.x, this.y / other.y);
    multiplyScalar = (scalar) => new Vector2(this.x * scalar, this.y * scalar);
    multiplyVector = (other) => new Vector2(this.x * other.x, this.y * other.y);
}
export var CollisionShape;
(function (CollisionShape) {
    CollisionShape[CollisionShape["Rectangle"] = 0] = "Rectangle";
    CollisionShape[CollisionShape["Circle"] = 1] = "Circle";
})(CollisionShape || (CollisionShape = {}));
export class Mouse {
    Position;
    Down;
    Selected;
    constructor(Position = new Vector2(), Down = [], Selected = null) {
        this.Position = Position;
        this.Down = Down;
        this.Selected = Selected;
    }
}
export class WorldInstance {
    Position;
    Size;
    constructor(Position = new Vector2(), Size = new Vector2()) {
        this.Position = Position;
        this.Size = Size;
    }
}
export class Listener {
    Object;
    Function;
    constructor(Object, Function) {
        this.Object = Object;
        this.Function = Function;
    }
}
