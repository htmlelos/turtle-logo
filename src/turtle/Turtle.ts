import { pipe } from "../utils/pipe";

export type Point = { readonly x: number; readonly y: number };
export const pointParser = (value: { x: number; y: number }) => {
  return value as Point;
};

export type Degree = number;
export const degreeParser = (value: number): Degree => {
  if (typeof value !== "number")
    throw new Error("degree value must be a number");
  if (value < -360 || value > 360)
    throw new Error("degree must be between -360 and 360 degree");

  return value;
};
export type State = "up" | "down";
export const stateParser = (value: string): State => {
  if (typeof value !== "string") throw new Error("state must be a string");
  if (!["up", "down"].includes(value))
    throw new Error('state must be "up" or "down" value only');
  return value as State;
};

export type Turtle = {
  readonly position: Point;
  readonly angle: Degree;
  readonly state: State;
  readonly context: CanvasRenderingContext2D;
};
export const turtleFactory =
  (position: Point, angle: Degree, state: State) =>
  (context: CanvasRenderingContext2D): Turtle => {
    return {
      position,
      angle,
      state,
      context,
    };
  };

const degreeToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

const calcNewPosition = (distance: number, angle: Degree, position: Point) => {
  const radians = degreeToRadians(angle);
  const { x, y } = position;
  return {
    x: Math.floor(x + distance * Math.cos(radians)),
    y: Math.floor(y + distance * Math.sin(radians)),
  };
};

export const moveAction = (distance: number) => (turtle: Turtle) => {
  const { angle, position, state, context } = turtle;
  const newPosition = calcNewPosition(distance, angle, position);
  if (state === "down") {
    // context.beginPath();
    context.moveTo(position.x, position.y);
    context.lineTo(newPosition.x, newPosition.y);
    context.stroke();
    // context.closePath();
  }

  if (state === "up") {
    context.moveTo(newPosition.x, newPosition.y);
  }

  const action = (turtle: Turtle, value: Point) => {
    return { ...turtle, position: pointParser(value) };
  };

  return action(turtle, position);
};

export const turnAction = (angle: Degree) => (turtle: Turtle) => {
  const action = (turtle: Turtle, angle: Degree) => {
    return { ...turtle, angle: degreeParser(turtle.angle + angle) };
  };

  return action(turtle, angle);
};

export const penUpAction = () => (turtle: Turtle) => {
  const action = (turtle: Turtle) => {
    return { ...turtle, state: stateParser("up") };
  };

  return action(turtle);
};

export const penDownAction = () => (turtle: Turtle) => {
  const action = (turtle: Turtle) => {
    return { ...turtle, state: stateParser("down") };
  };

  return action(turtle);
};

export const getTurtleAction = () => (turtle: Turtle) => {
  const action = (turtle: Turtle) => {
    return turtle;
  };

  return action(turtle);
};

type Pattern<T, R> = { when: (value: T) => boolean; then: (value: T) => R };

const match = <T, R>(value: T, patterns: Pattern<T, R>[]): R => {
  const command = patterns.find((command) => command.when(value));
  if (command) {
    return command.then(value);
  }
  throw new Error(`Command ${value} not found`);
};

type CommandName = "MOVE" | "TURN" | "PEN UP" | "PEN DOWN";

type Command = { name: CommandName; value?: number | Degree };
const executeCommand =
  (action: Command) =>
  (turtle: Turtle): Turtle => {
    return match<Command, Turtle>(action, [
      {
        when: (action) => action.name === "MOVE",
        then: (action) => moveAction(action.value ?? 0)(turtle),
      },
      {
        when: (action) => action.name === "TURN",
        then: (action) => turnAction(action.value ?? 0)(turtle),
      },
      {
        when: (action) => action.name === "PEN UP",
        then: () => penUpAction()(turtle),
      },
      {
        when: (action) => action.name === "PEN DOWN",
        then: () => penDownAction()(turtle),
      },
      { when: () => true, then: () => getTurtleAction()(turtle) },
    ]);
  };

// Command Factory
const commandFactory = (name: CommandName, value?: number | Degree) => {
  return { name, value } as Command;
};

// Command Batch Processing
const comandBatchProcessing = (commands: Command[]) => (turtle: Turtle) => {
  const result = commands.reduce((turtle, command) => {
    return executeCommand(command)(turtle);
  }, turtle);
};

const commandList: Command[] = [] as Command[];

commandList.push(commandFactory("PEN UP"));
commandList.push(commandFactory("MOVE", 50));
commandList.push(commandFactory("TURN", 90));
commandList.push(commandFactory("MOVE", 50));
commandList.push(commandFactory("TURN", 90));
commandList.push(commandFactory("MOVE", 50));
commandList.push(commandFactory("TURN", 90));
commandList.push(commandFactory("PEN DOWN"));

comandBatchProcessing(commandList);
