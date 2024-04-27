export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize = () => this.multiplyScalar(1 / this.magnitude());
        this.dot = (other) => this.x * other.x + this.y * other.y;
        this.angleBetween = (other) => Math.acos(this.dot(other) / (this.magnitude() * other.magnitude()));
        this.add = (other) => new Vector2(this.x + other.x, this.y + other.y);
        this.subtract = (other) => new Vector2(this.x - other.x, this.y - other.y);
        this.divide = (other) => new Vector2(this.x / other.x, this.y / other.y);
        this.multiplyScalar = (scalar) => new Vector2(this.x * scalar, this.y * scalar);
        this.multiplyVector = (other) => new Vector2(this.x * other.x, this.y * other.y);
    }
}
export var CollisionShape;
(function (CollisionShape) {
    CollisionShape[CollisionShape["Rectangle"] = 0] = "Rectangle";
    CollisionShape[CollisionShape["Circle"] = 1] = "Circle";
})(CollisionShape || (CollisionShape = {}));
export class Mouse {
    constructor(Position = new Vector2(), Down = [], Selected = null) {
        this.Position = Position;
        this.Down = Down;
        this.Selected = Selected;
    }
}
export class WorldInstance {
    constructor(Position = new Vector2(), Size = new Vector2(), Rotation = 0) {
        this.Position = Position;
        this.Size = Size;
        this.Rotation = Rotation;
    }
}
export class Listener {
    constructor(Object, Function) {
        this.Object = Object;
        this.Function = Function;
    }
}
