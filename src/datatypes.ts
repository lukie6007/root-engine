import { Component } from "./base.js"

export class Vector2 {
    constructor(public x: number = 0, public y: number = 0) { }

    magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y);
    normalize = () => this.multiplyScalar(1 / this.magnitude());
    dot = (other: Vector2) => this.x * other.x + this.y * other.y;
    angleBetween = (other: Vector2) => Math.acos(this.dot(other) / (this.magnitude() * other.magnitude()));
    add = (other: Vector2) => new Vector2(this.x + other.x, this.y + other.y);
    subtract = (other: Vector2) => new Vector2(this.x - other.x, this.y - other.y);
    divide = (other: Vector2) => new Vector2(this.x / other.x, this.y / other.y);
    multiplyScalar = (scalar: number) => new Vector2(this.x * scalar, this.y * scalar);
    multiplyVector = (other: Vector2) => new Vector2(this.x * other.x, this.y * other.y);
}

export class Vector3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

  get magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vector3 {
    const magnitude = this.magnitude;
    return new Vector3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
  }

  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  angleBetween(other: Vector3): number {
    return Math.acos(this.dot(other) / (this.magnitude * other.magnitude));
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  divide(other: Vector3): Vector3 {
    return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
  }

  multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  multiplyVector(other: Vector3): Vector3 {
    return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  crossProduct(other: Vector3): Vector3 {
    return new Vector3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
}

export enum CollisionShape {
    Rectangle,
    Circle
}

export class Mouse {
    constructor(public Position: Vector2 = new Vector2(), public Down: string[] = [], public Selected: Component | null = null) { }
}

export class WorldInstance {
    constructor(public Position: Vector2 = new Vector2(), public Size: Vector2 = new Vector2(), public Rotation: number = 0) { }
}

export class Listener {
    constructor(public Object: object, public Function: Function) { }
}