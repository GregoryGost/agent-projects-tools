# TypeScript Class Testing Patterns

Use this reference when tests cover TypeScript classes, object modeling, constructor invariants, stateful behavior, lifecycle, or collaborators.

Examples use neutral `assert*` helpers as placeholders for the project-declared test runner assertion API. Replace them with the assertion style already used by the target project.

## Baseline

- Preserve the function/module vs class choice made by `typescript-core`.
- Test public behavior instead of private implementation details.
- Test constructor invariants when a constructor validates or normalizes state.
- Test state transitions through public methods.
- Test collaborator interaction through typed fakes, stubs, or mocks.
- Keep tests deterministic by controlling time, randomness, IDs, IO, storage, network, and filesystem boundaries.

## Bad: Testing Private Implementation

```ts
class Counter {
  private value = 0

  increment(): void {
    this.value += 1
  }

  current(): number {
    return this.value
  }
}

const counter = new Counter()

counter.increment()

assertEqual((counter as any).value, 1)
```

Problems:

- The test uses `any` to bypass class visibility.
- The test is coupled to implementation details.
- The public contract is not what the assertion targets.

## Good: Testing Public Behavior

```ts
const counter = new Counter()

counter.increment()

assertEqual(counter.current(), 1)
```

## Constructor Invariants

```ts
class Percentage {
  constructor(readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Percentage must be between 0 and 100')
    }
  }
}

assertThrows(
  () => new Percentage(120),
  'Percentage must be between 0 and 100',
)
```

## Collaborator Testing With A Typed Fake

```ts
interface ProductRepository {
  findById(productId: string): Promise<Product | undefined>
}

class FakeProductRepository implements ProductRepository {
  constructor(private readonly product: Product | undefined) {}

  async findById(): Promise<Product | undefined> {
    return this.product
  }
}

const service = new ProductPricingService(
  new FakeProductRepository(undefined),
  fixedPricePolicy,
)

assertEqual(await service.priceFor('missing'), undefined)
```

## Review Questions

- Does the test respect the class public API?
- Does it avoid direct private-member assertions?
- Does it cover constructor validation and state transitions when relevant?
- Are collaborators typed and intentionally fake or mocked?
- Does it preserve the project error/result convention?
