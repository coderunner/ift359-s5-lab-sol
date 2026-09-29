import { describe, it, expect } from "vitest";
import { employes, whereId, select, join, q2, q1, q3, Employe, Departement, departements } from "../src/miniql.js";

describe("Exercices Semaine 5 - Langage de requêtes relationnel", () => {
  describe("Clauses unitaires", () => {
    describe("whereId", () => {
      it("filtre un élément par son identifiant numérique", () => {
        const filtreId = whereId<Employe>(3);
        const res = filtreId(employes);
        expect(res).toEqual([{ id: 3, nom: "Charlie", deptId: "MAT", salaire: 75000 }]);
      });

      it("filtre un élément par son identifiant textuel (string)", () => {
        const filtreId = whereId<Departement>("MAT");
        const res = filtreId(departements);
        expect(res).toEqual([{ id: "MAT", nom: "Mathématiques" }]);
      });

      it("retourne un tableau vide si l'id n'existe pas", () => {
        const filtreInexistant = whereId<Employe>(999);
        expect(filtreInexistant(employes)).toEqual([]);
      });

      it("retourne un tableau vide sur une table vide", () => {
        const filtre = whereId<{ readonly id: number }>(1);
        expect(filtre([])).toEqual([]);
      });
    });

    describe("select", () => {
      it("projette les lignes vers un nouveau format d'objet", () => {
        const projection = select((e: Employe) => ({
          nom: e.nom,
          salaire: e.salaire,
        }));
        const res = projection(employes.slice(0, 2));
        expect(res).toEqual([
          { nom: "Alice", salaire: 90000 },
          { nom: "Bob", salaire: 65000 },
        ]);
      });

      it("extrait une valeur scalaire simple pour chaque ligne", () => {
        const projectionNoms = select((e: Employe) => e.nom);
        expect(projectionNoms(employes)).toEqual(["Alice", "Bob", "Charlie", "Diane", "Eve"]);
      });

      it("retourne un tableau vide lorsqu'appliqué sur une table vide", () => {
        const projection = select((x: number) => x * 2);
        expect(projection([])).toEqual([]);
      });
    });

    describe("join", () => {
      it("effectue une jointure interne (inner join) selon la condition et fusionne les lignes", () => {
        const jointure = join(
          departements,
          (e: Employe, d: Departement) => e.deptId === d.id,
          (e: Employe, d: Departement) => ({
            employe: e.nom,
            departement: d.nom,
          }),
        );

        const res = jointure([employes[0], employes[2]]);
        expect(res).toEqual([
          { employe: "Alice", departement: "Informatique" },
          { employe: "Charlie", departement: "Mathématiques" },
        ]);
      });

      it("exclut les éléments qui n'ont aucune correspondance dans l'autre table", () => {
        const employeSansDept = [{ id: 99, nom: "Inconnu", deptId: "PHY", salaire: 40000 }];
        const jointure = join(
          departements,
          (e: Employe, d: Departement) => e.deptId === d.id,
          (e: Employe, d: Departement) => ({ nom: e.nom, dept: d.nom }),
        );
        expect(jointure(employeSansDept)).toEqual([]);
      });

      it("gère les jointures 1-à-plusieurs en dupliquant la ligne gauche", () => {
        type TypeA = { code: string };
        type TypeB = { parent: string; val: number };
        const tableA: TypeA[] = [{ code: "X" }];
        const tableB = [
          { parent: "X", val: 1 },
          { parent: "X", val: 2 },
        ];

        const jointure = join(
          tableB,
          (a: TypeA, b: TypeB) => a.code === b.parent,
          (a: TypeA, b: TypeB) => `${a.code}-${b.val}`,
        );

        expect(jointure(tableA)).toEqual(["X-1", "X-2"]);
      });

      it("retourne un tableau vide si l'une des deux tables est vide", () => {
        const jointure = join(
          departements,
          (e: Employe, d: Departement) => e.deptId === d.id,
          (e: Employe, d: Departement) => e.nom,
        );
        expect(jointure([])).toEqual([]);

        const jointureTableVide = join(
          [],
          (e: Employe, d: Departement) => true,
          (e, d) => e.nom,
        );
        expect(jointureTableVide(employes)).toEqual([]);
      });
    });
  });

  describe("Validation des requêtes du TP", () => {
    it("q1 : SELECT nom, salaire FROM employes WHERE deptId = 'IFT' LIMIT 1", () => {
      // Alice est le premier employé du département IFT
      expect(q2).toEqual([{ nom: "Alice", salaire: 90000 }]);
    });

    it("q2 : Trouver le département avec l'id 'MAT' via whereId", () => {
      expect(q1).toEqual([{ id: "MAT", nom: "Mathématiques" }]);
    });

    it("q3 : Liste de tous les employés avec le nom de leur département", () => {
      expect(q3).toEqual([
        { id: 1, nom: "Alice", departement: "Informatique", salaire: 90000 },
        { id: 2, nom: "Bob", departement: "Informatique", salaire: 65000 },
        { id: 3, nom: "Charlie", departement: "Mathématiques", salaire: 75000 },
        { id: 4, nom: "Diane", departement: "Informatique", salaire: 110000 },
        { id: 5, nom: "Eve", departement: "Mathématiques", salaire: 50000 },
      ]);
    });
  });
});
