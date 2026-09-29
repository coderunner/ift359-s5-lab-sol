import { describe, it, expect } from "vitest";
import { somme, sommeF, sommeFR, concatF } from "../src/exercices.js";
import { liste, vide, tete, reste, type Liste } from "../src/liste.js";

// Utilitaires de test pour manipuler Liste<A>
const creerListe = <A>(...elements: A[]): Liste<A> =>
  elements.reduceRight<Liste<A>>((acc, val) => liste(val, acc), null);

const versTableau = <A>(l: Liste<A>): A[] => {
  const tab: A[] = [];
  let cur = l;
  while (!vide(cur)) {
    tab.push(tete(cur)!);
    cur = reste(cur);
  }
  return tab;
};

describe("Exercices semaine 5 - FOS (fold, reduce, foldRight)", () => {
  function testSomme(fonctionSomme: (l: Liste<number>) => number) {
    it("calcule la somme d'une liste de nombres positifs", () => {
      const l = creerListe(1, 2, 3, 4, 5);
      expect(fonctionSomme(l)).toBe(15);
    });

    it("gère les nombres négatifs et nuls", () => {
      const l = creerListe(-10, 5, 0, 15, -2);
      expect(fonctionSomme(l)).toBe(8);
    });

    it("retourne la valeur du singleton", () => {
      const l = creerListe(42);
      expect(fonctionSomme(l)).toBe(42);
    });

    it("retourne 0 pour une liste vide", () => {
      expect(fonctionSomme(null)).toBe(0);
    });
  }
  // ----------------------------------------------------------
  // 1. somme (via reduce)
  // ----------------------------------------------------------
  describe("1 - somme (avec reduce)", () => {
    testSomme(somme);
  });

  // ----------------------------------------------------------
  // 2. sommeF (via fold / foldLeft)
  // ----------------------------------------------------------
  describe("2 - sommeF (avec fold)", () => {
    testSomme(sommeF);
  });

  // ----------------------------------------------------------
  // 3. sommeFR (via foldRight)
  // ----------------------------------------------------------
  describe("3 - sommeFR (avec foldRight)", () => {
    testSomme(sommeFR);
  });

  // ----------------------------------------------------------
  // 4. concatF (via fold / foldRight)
  // ----------------------------------------------------------
  describe("4 - concatF (avec fold ou foldRight)", () => {
    it("concatène deux listes non vides en préservant l'ordre naturel", () => {
      const l1 = creerListe(1, 2, 3);
      const l2 = creerListe(4, 5, 6);
      const res = concatF(l1, l2);

      expect(versTableau(res)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("concatène avec des listes de chaînes de caractères", () => {
      const l1 = creerListe("a", "b");
      const l2 = creerListe("c", "d");
      const res = concatF(l1, l2);

      expect(versTableau(res)).toEqual(["a", "b", "c", "d"]);
    });

    it("gère l1 vide (doit renvoyer une structure équivalente à l2)", () => {
      const l2 = creerListe(10, 20);
      const res = concatF(null, l2);

      expect(versTableau(res)).toEqual([10, 20]);
    });

    it("gère l2 vide (doit renvoyer une structure équivalente à l1)", () => {
      const l1 = creerListe(10, 20);
      const res = concatF(l1, null);

      expect(versTableau(res)).toEqual([10, 20]);
    });

    it("gère deux listes vides", () => {
      const res = concatF(null, null);
      expect(vide(res)).toBe(true);
    });
  });
});
