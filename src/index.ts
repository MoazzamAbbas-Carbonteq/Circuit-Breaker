export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  failureThreshold: number
  recoveryTimeout: number
}

export class CircuitBreaker {
  private state: CircuitBreakerState = CircuitBreakerState.CLOSED
  private failureCount: number = 0
  private lastFailureTime: number = 0
  private options: CircuitBreakerOptions

  constructor(options: CircuitBreakerOptions) {
    this.options = options
  }

  private reset(): void {
    this.state = CircuitBreakerState.CLOSED
    this.failureCount = 0
  }

  private checkRecovery(): void {
    if (this.state === CircuitBreakerState.HALF_OPEN) {
      if (Date.now() - this.lastFailureTime > this.options.recoveryTimeout) {
        this.reset()
      }
    }
  }

  public async call<T>(fn: () => Promise<T>): Promise<T> {
    this.checkRecovery()

    if (this.state === CircuitBreakerState.OPEN) {
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = await fn()
      this.reset()
      return result
    } catch (error) {
      this.failureCount++
      this.lastFailureTime = Date.now()

      if (this.failureCount >= this.options.failureThreshold) {
        this.state = CircuitBreakerState.OPEN
        setTimeout(
          () => (this.state = CircuitBreakerState.HALF_OPEN),
          this.options.recoveryTimeout,
        )
      }

      throw error
    }
  }
}
