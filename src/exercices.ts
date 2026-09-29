import { fold, foldRight, liste, Liste, reduce, vide } from "./liste.js";

// 1 - Écrire la fonction suivante qui somme les valeurs d'une liste en utilisant uniquement reduce
export function somme(l: Liste<number>): number {
  return reduce(l, (acc: number, val: number) => acc + val) ?? 0;
}

// 2 - Écrire la fonction suivante qui somme les valeurs d'une liste en utilisant uniquement fold
export function sommeF(l: Liste<number>): number {
  return fold(l, 0, (acc, val) => acc + val);
}

// 3 - Écrire la fonction suivante qui somme les valeurs d'une liste en utilisant uniquement foldRight
export function sommeFR(l: Liste<number>): number {
  return foldRight(l, 0, (val, acc) => acc + val);
}

// 4 - Écrire la fonction concat en utilisant fold (foldLeft ou foldRight?)
export function concatF<A>(l1: Liste<A>, l2: Liste<A>): Liste<A> {
  return foldRight(l1, l2, (val, acc) => liste(val, acc));
}
