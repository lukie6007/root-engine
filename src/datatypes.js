export class Vector2 { constructor(t = 0, i = 0) { this.x = t, this.y = i, this.magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y), this.normalize = () => this.multiplyScalar(1 / this.magnitude()), this.dot = t => this.x * t.x + this.y * t.y, this.angleBetween = t => Math.acos(this.dot(t) / (this.magnitude() * t.magnitude())), this.add = t => new Vector2(this.x + t.x, this.y + t.y), this.subtract = t => new Vector2(this.x - t.x, this.y - t.y), this.divide = t => new Vector2(this.x / t.x, this.y / t.y), this.multiplyScalar = t => new Vector2(this.x * t, this.y * t), this.multiplyVector = t => new Vector2(this.x * t.x, this.y * t.y) } } export var CollisionShape; !function (t) { t[t.Rectangle = 0] = "Rectangle", t[t.Circle = 1] = "Circle" }(CollisionShape || (CollisionShape = {})); export class Mouse { constructor(t = new Vector2, i = [], s = null) { this.Position = t, this.Down = i, this.Selected = s } } export class WorldInstance { constructor(t = new Vector2, i = new Vector2) { this.Position = t, this.Size = i } } export class Listener { constructor(t, i) { this.Object = t, this.Function = i } }