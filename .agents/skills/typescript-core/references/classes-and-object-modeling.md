# TypeScript Classes And Object Modeling

Use this reference when deciding whether TypeScript behavior should be modeled as a function/module or as a class.

## Rule

Prefer functions/modules for stateless pure transformations, small mappers, predicates, parsers, formatters, and calculations.

Prefer classes when the model has identity, state, constructor invariants, lifecycle, collaborating objects, or polymorphic behavior.

Do not convert a class to functions merely because the logic could be written as functions if the class better protects invariants or public contracts.

## When To Prefer A Class

- The object has identity and state that should stay with behavior.
- The constructor establishes invariants required by all methods.
- Several methods reuse the same constructor-supplied collaborators.
- The object has lifecycle or resource ownership.
- The class implements an interface used by a boundary.
- Subclasses are intentionally substitutable for a base class.
- A framework or runtime API expects a class.

## When To Prefer Functions Or Modules

- The logic is stateless and pure.
- The behavior is a small mapper, predicate, parser, formatter, or calculation.
- A class would only group static helpers.
- A class would have only a constructor and no durable fields or behavior.
- There is no object identity or invariant to protect.
