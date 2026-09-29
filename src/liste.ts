import { deuxieme, paire, Paire, premier } from "./paire.js";

export type Liste<A> = Paire<A, Liste<A>> | null;

export function liste<A>(tete: A, reste: Liste<A>): Liste<A> {
  return paire(tete, reste);
}

export function depuisTableau<A>(tableau: A[]): Liste<A> {
  return tableau.reduceRight<Liste<A>>((acc, element) => liste(element, acc), null);
}

export function tete<A>(liste: Paire<A, Liste<A>>): A;
export function tete<A>(liste: Liste<A>): A | null;
export function tete<A>(liste: Liste<A>): A | null {
  return liste ? premier(liste) : null;
}

export function reste<A>(liste: Liste<A>): Liste<A> {
  return liste ? deuxieme(liste) : null;
}

export function vide<A>(liste: Liste<A>): liste is null {
  return liste === null;
}

export function longueur<A>(liste: Liste<A>): number {
  function iter(liste: Liste<A>, acc: number) {
    if (vide(liste)) {
      return acc;
    }
    return iter(reste(liste), acc + 1);
  }
  return iter(liste, 0);
}

export function concat<A>(l1: Liste<A>, l2: Liste<A>): Liste<A> {
  function iter(l: Liste<A>, acc: Liste<A> | null) {
    if (vide(l)) {
      return acc;
    }
    return iter(reste(l), liste(tete(l), acc));
  }
  return iter(inverse(l1), l2);
}

export function inverse<A>(l: Liste<A>): Liste<A> {
  function iter(l1: Liste<A>, acc: Liste<A>): Liste<A> {
    if (vide(l1)) {
      return acc;
    }
    return iter(reste(l1), liste(tete(l1), acc));
  }
  return iter(l, null);
}

export function versTableau<A>(l: Liste<A>): A[] {
  if (vide(l)) {
    return [];
  }
  return [tete(l), ...versTableau(reste(l))];
}

export function afficher<A>(l: Liste<A>): string {
  return `[${versTableau(l).join(", ")}]`;
}

export function map<A, B>(l: Liste<A>, f: (e: A) => B): Liste<B> {
  if (vide(l)) {
    return null;
  }
  return liste(f(tete(l)), map(reste(l), f));
}

export function mapT<A, B>(l: Liste<A>, f: (e: A) => B): Liste<B> {
  function iter(l1: Liste<A>, acc: Liste<B>): Liste<B> {
    if (vide(l1)) {
      return acc;
    }
    return iter(reste(l1), liste(f(tete(l1)), acc));
  }
  return inverse(iter(l, null));
}

// FILTER
export function filter<A>(l: Liste<A>, p: (e: A) => boolean): Liste<A> {
  if (vide(l)) {
    return null;
  }
  const premier = tete(l);
  if (p(premier)) {
    return liste(premier, filter(reste(l), p));
  }
  return filter(reste(l), p);
}

export function filterT<A>(l: Liste<A>, p: (e: A) => boolean): Liste<A> {
  function iter(l1: Liste<A>, acc: Liste<A>): Liste<A> {
    if (vide(l1)) {
      return acc;
    }
    const premier = tete(l1);
    if (p(premier)) {
      return iter(reste(l1), liste(premier, acc));
    }
    return iter(reste(l1), acc);
  }
  return inverse(iter(l, null));
}

export function flatMap<A, B>(l: Liste<A>, f: (e: A) => Liste<B>): Liste<B> {
  if (vide(l)) {
    return null;
  }
  return concat(f(tete(l)), flatMap(reste(l), f));
}

export function flatMapT<A, B>(l: Liste<A>, f: (e: A) => Liste<B>): Liste<B> {
  function empiler(source: Liste<B>, acc: Liste<B>): Liste<B> {
    if (vide(source)) {
      return acc;
    }
    return empiler(reste(source), liste(tete(source)!, acc));
  }
  function iter(l1: Liste<A>, acc: Liste<B>): Liste<B> {
    if (vide(l1)) {
      return acc;
    }
    const sousListe = f(tete(l1));
    return iter(reste(l1), empiler(sousListe, acc));
  }
  return inverse(iter(l, null));
}

export function reduce<A>(l: Liste<A>, combiner: (acc: A, val: A) => A): A | null {
  if (vide(l)) {
    return null;
  }
  if (vide(reste(l))) {
    return tete(l);
  }
  // ! indique au compilateur que le reduce ne produira pas de null, car reste(l) n'est pas vide
  return combiner(tete(l), reduce(reste(l), combiner)!);
}

export function reduceT<A>(l: Liste<A>, combiner: (acc: A, val: A) => A): A | null {
  if (vide(l)) {
    return null;
  }
  function iter(l1: Liste<A>, acc: A) {
    if (vide(l1)) {
      return acc;
    }
    const premier = tete(l1);
    return iter(reste(l1), combiner(acc, premier));
  }
  return iter(reste(l), tete(l));
}

export function fold<A, R>(l: Liste<A>, initial: R, combiner: (acc: R, val: A) => R): R {
  if (vide(l)) {
    return initial;
  }
  // tailrec!
  return fold(reste(l), combiner(initial, tete(l)), combiner);
}

export function foldRight<A, R>(l: Liste<A>, initial: R, combiner: (val: A, acc: R) => R): R {
  if (vide(l)) {
    return initial;
  }
  return combiner(tete(l), foldRight(reste(l), initial, combiner));
}

export function longueurF<A>(l: Liste<A>): number {
  return fold(l, 0, (acc, _) => acc + 1);
}

export function mapF<A, B>(l: Liste<A>, f: (a: A) => B): Liste<B> {
  return foldRight(l, null, (val: A, acc: Liste<B>) => liste(f(val), acc));
}

export function filterF<A>(l: Liste<A>, p: (a: A) => boolean): Liste<A> {
  return foldRight(l, null, (val: A, acc: Liste<A>) => (p(val) ? liste(val, acc) : acc));
}

export function flatMapF<A, B>(l: Liste<A>, op: (a: A) => Liste<B>): Liste<B> {
  return foldRight(l, null, (val: A, acc: Liste<B>) => concat(op(val), acc));
}

export function find<A>(l: Liste<A>, p: (a: A) => boolean): A | null {
  if (vide(l)) {
    return null;
  }
  const premier = tete(l);
  if (p(premier)) {
    return premier;
  }
  return find(reste(l), p);
}

export function every<A>(l: Liste<A>, p: (a: A) => boolean): boolean {
  if (vide(l)) {
    return true;
  }
  const premier = tete(l);
  if (!p(premier)) {
    return false;
  }
  return every(reste(l), p);
}

export function some<A>(l: Liste<A>, p: (a: A) => boolean): boolean {
  if (vide(l)) {
    return false;
  }
  const premier = tete(l);
  if (p(premier)) {
    return true;
  }
  return some(reste(l), p);
}
