import { useEffect, useRef } from "react";
import {
  degreeParser,
  moveAction,
  penDownAction,
  penUpAction,
  pointParser,
  stateParser,
  turnAction,
  turtleFactory,
} from "../turtle/Turtle";
import { pipe } from "../utils/pipe";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = ({ width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef?.current?.getContext("2d");
      if (context) {
        const turtle = turtleFactory(
          pointParser({ x: 100, y: 100 }),
          degreeParser(90),
          stateParser("up")
        )(context);

        pipe(
          penDownAction(),
          moveAction(50),
          turnAction(degreeParser(90)),
          moveAction(50),
          turnAction(degreeParser(90)),
          moveAction(50),
          turnAction(degreeParser(90)),
          moveAction(50),
          penUpAction()
        )(turtle);
      }
    }
  });

  return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default Canvas;
