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
    multiplyScalar = (scalar) => new Vector2(this.x * scalar, this.y * scalar);
    multiplyVector = (other) => new Vector2(this.x * other.x, this.y * other.y);
}
export var CollisionShape;
(function (CollisionShape) {
    CollisionShape[CollisionShape["Rectangle"] = 0] = "Rectangle";
    CollisionShape[CollisionShape["Circle"] = 1] = "Circle";
})(CollisionShape || (CollisionShape = {}));
export class WorldInstance {
    Position;
    Size;
    CollisionSize;
    CollisionShape;
    constructor(Position, Size, CollisionSize, CollisionShape) {
        this.Position = Position;
        this.Size = Size;
        this.CollisionSize = CollisionSize;
        this.CollisionShape = CollisionShape;
    }
}
export class Mouse {
    Position;
    Down;
    Selected;
    constructor(Position, Down, Selected) {
        this.Position = Position;
        this.Down = Down;
        this.Selected = Selected;
    }
}
