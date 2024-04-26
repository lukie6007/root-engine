import { Component } from "./base.js"

export class Vector2 {
    constructor(public x: number = 0, public y: number = 0) { }

    magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);
    normalize = () => this.multiplyScalar(1 / this.magnitude());
    dot = (other: Vector2) => this.x * other.x + this.y * other.y;
    angleBetween = (other: Vector2) => Math.acos(this.dot(other) / (this.magnitude() * other.magnitude()));
    add = (other: Vector2) => new Vector2(this.x + other.x, this.y + other.y);
    subtract = (other: Vector2) => new Vector2(this.x - other.x, this.y - other.y);
    multiplyScalar = (scalar: number) => new Vector2(this.x * scalar, this.y * scalar);
    multiplyVector = (other: Vector2) => new Vector2(this.x * other.x, this.y * other.y);
}

export enum CollisionShape {
    Rectangle,
    Circle
}

export class Mouse {
    constructor(public Position: Vector2, public Down: string[], public Selected: Component) { }
}

export class WorldInstance {
    CollisionShape: CollisionShape
    constructor(public Position: Vector2 = new Vector2(), public Size: Vector2 = new Vector2(), public CollisionSize: Vector2 = new Vector2()) { this.CollisionShape = CollisionShape.Rectangle }
}