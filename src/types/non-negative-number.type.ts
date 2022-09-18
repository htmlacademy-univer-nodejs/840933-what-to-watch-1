export type NonNegative<T extends number> =
    number extends T
        ? never
        : `${T}` extends `-${string}`
            ? never
            : T;
