# TypeScript Class Testing Patterns

Use this reference when tests cover TypeScript classes, object modeling, constructor invariants, stateful behavior, lifecycle, or collaborators.

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

it('increments value', () => {
  const counter = new Counter()

  counter.increment()

  expect((counter as any).value).toBe(1)
})
```

Problems:

- The test uses `any` to bypass class visibility.
- The test is coupled to implementation details.
- The public contract is not what the assertion targets.

## Good: Testing Public Behavior

```ts
it('increments the visible count', () => {
  const counter = new Counter()

  counter.increment()

  expect(counter.current()).toBe(1)
})
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

it('rejects invalid percentage values', () => {
  expect(() => new Percentage(120)).toThrow('Percentage must be between 0 and 100')
})
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

it('returns undefined when product is missing', async () => {
  const service = new ProductPricingService(
    new FakeProductRepository(undefined),
    fixedPricePolicy,
  )

  await expect(service.priceFor('missing')).resolves.toBeUndefined()
})
```

## Review Questions

- Does the test respect the class public API?
- Does it avoid direct private-member assertions?
- Does it cover constructor validation and state transitions when relevant?
- Are collaborators typed and intentionally fake or mocked?
- Does it preserve the project error/result convention?
