export interface Paire<A, B> {
  readonly _1: A;
  readonly _2: B;
}

export function paire<A, B>(premier: A, deuxieme: B): Paire<A, B> {
  return { _1: premier, _2: deuxieme };
}

export function premier<A, B>(p: Paire<A, B>): A {
  return p._1;
}

export function deuxieme<A, B>(p: Paire<A, B>): B {
  return p._2;
}

export function afficher<A, B>(p: Paire<A, B>): string {
  return `(${premier(p)},${deuxieme(p)})`;
}
