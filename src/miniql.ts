export interface Employe {
  readonly id: number;
  readonly nom: string;
  readonly deptId: string;
  readonly salaire: number;
}

export interface Departement {
  readonly id: string;
  readonly nom: string;
}

export const employes: Employe[] = [
  { id: 1, nom: "Alice", deptId: "IFT", salaire: 90000 },
  { id: 2, nom: "Bob", deptId: "IFT", salaire: 65000 },
  { id: 3, nom: "Charlie", deptId: "MAT", salaire: 75000 },
  { id: 4, nom: "Diane", deptId: "IFT", salaire: 110000 },
  { id: 5, nom: "Eve", deptId: "MAT", salaire: 50000 },
];

export const departements: Departement[] = [
  { id: "IFT", nom: "Informatique" },
  { id: "MAT", nom: "Mathématiques" },
];

export type Clause<T, R> = (table: T[]) => R[];

export function where<T>(predicat: (ligne: T) => boolean): Clause<T, T> {
  return (table) => table.filter(predicat);
}

/**
 * @param id
 * @returns Clause qui, lorsqu'appliquée sur une table T, retourne l'élément avec l'id reçu en paramètre ou un tableau vide.
 */
export function whereId<T extends { readonly id: number | string }>(id: T["id"]): Clause<T, T> {
  return (table: T[]) => {
    const f = table.find((val) => val.id === id);
    return f !== undefined ? [f] : [];
  };
}

export function limit<T>(n: number): Clause<T, T> {
  return (table) => table.slice(0, n);
}

/**
 *
 * @param projection transformation qui prend un enregistrement et le transforme en une valeur de type R
 * @returns Clause qui transforme les éléments de la table selon la projection reçue
 */
export function select<T, R>(projection: (ligne: T) => R): Clause<T, R> {
  return (table) => table.map(projection);
}

/**
 *
 * @param autreTable la table à joindre
 * @param condition la condition de la jointure
 * @param fusion l'opération qui reçoit les deux éléments à joindre
 * @returns Clause qui joint deux tables selon une condition précise et qui les fusionne selon une opération de fusion
 */
// export function join<A, B, R>(
//   autreTable: B[],
//   condition: (a: A, b: B) => boolean,
//   fusion: (a: A, b: B) => R,
// ): Clause<A, R> {
//   return (table) => table.flatMap((r1) => autreTable.flatMap((r2) => (condition(r1, r2) ? [fusion(r1, r2)] : [])));
// }
export function join<A, B, R>(
  autreTable: B[],
  condition: (a: A, b: B) => boolean,
  fusion: (a: A, b: B) => R,
): Clause<A, R> {
  return (table) => table.flatMap((r1) => autreTable.filter((r2) => condition(r1, r2)).map((r2) => fusion(r1, r2)));
}

export function query<T, A>(table: T[], c1: Clause<T, A>): A[];
export function query<T, A, B>(table: T[], c1: Clause<T, A>, c2: Clause<A, B>): B[];
export function query<T, A, B, C>(table: T[], c1: Clause<T, A>, c2: Clause<A, B>, c3: Clause<B, C>): C[];
export function query<T, A, B, C, D>(
  table: T[],
  c1: Clause<T, A>,
  c2: Clause<A, B>,
  c3: Clause<B, C>,
  c4: Clause<C, D>,
): D[];
export function query(table: any[], ...clauses: Clause<any, any>[]): any[] {
  return clauses.reduce((acc, clause) => clause(acc), table);
}

// Trouver le département avec l'id "MAT" via whereId
export const q1 = query(departements, whereId("MAT"));

// Écrire l'équivalent de SELECT nom, salaire FROM employes WHERE deptId = 'IFT' LIMIT 1;
export const q2 = query(
  employes,
  where((e) => e.deptId === "IFT"),
  select((r) => ({ nom: r.nom, salaire: r.salaire })),
  limit(1),
);

// Obtenir la liste des employés (id, nom, salaire) et le nom complet de leur département (clé departement) (au lieu de l'id du département)
export const q3: { id: number; nom: string; salaire: number; departement: string }[] = query(
  employes,
  join(
    departements,
    (e: Employe, d: Departement) => e.deptId === d.id,
    (e: Employe, d: Departement) => ({ id: e.id, nom: e.nom, salaire: e.salaire, departement: d.nom }),
  ),
);
