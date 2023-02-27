export type Left<T> = {
  left: T;
  right?: never;
};

export type Right<U> = {
  left?: never;
  right: U;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export type UnwrapEither = <T, U>(e: Either<T, U>) => NonNullable<T | U>;

export const unwrapEither: UnwrapEither = <T, U>({
  left,
  right,
}: Either<T, U>) => {
  if (right !== undefined && left !== undefined) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(
        left
      )}\nRight: ${JSON.stringify(right)}`
    );
    /*
		Lanzamos esta excepcion en esta funcion porque esta solo puede ocurrir en 
    tiempo de ejecucion si algo sucede que el compilador de TypeScript no pudo 
     anticipar. Esto significa que la aplicación se encuentra en un estado inestable
     y deberia finalizar su ejecución inmediatamente.
		*/
  }
  if (left !== undefined) {
    return left as NonNullable<T>; // Typescript is getting confused and returning this type as `T | undefined` unless we add the type assertion
  }
  if (right !== undefined) {
    return right as NonNullable<U>;
  }
  throw new Error(
    `Received no left or right values at runtime when opening Either`
  );
};

export const isLeft = <T, U>(e: Either<T, U>): e is Left<T> => {
  return e.left !== undefined;
};

export const isRight = <T, U>(e: Either<T, U>): e is Right<U> => {
  return e.right !== undefined;
};

export const makeLeft = <T>(value: T): Left<T> => ({ left: value });

export const makeRight = <U>(value: U): Right<U> => ({ right: value });
