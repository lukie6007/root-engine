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
export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        const magnitude = this.magnitude;
        return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }
    angleBetween(other) {
        return Math.acos(this.dot(other) / (this.magnitude * other.magnitude));
    }
    add(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    subtract(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    divide(other) {
        return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
    }
    multiplyScalar(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    multiplyVector(other) {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }
    crossProduct(other) {
        return new Vector3(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
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
