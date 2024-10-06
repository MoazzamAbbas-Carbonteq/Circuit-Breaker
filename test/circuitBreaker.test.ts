jest.useFakeTimers()
import { CircuitBreaker, CircuitBreakerState } from '../src'

describe('CircuitBreaker', () => {
  const options = {
    failureThreshold: 3,
    recoveryTimeout: 30000,
  }

  let circuitBreaker: CircuitBreaker

  beforeEach(() => {
    circuitBreaker = new CircuitBreaker(options)
  })

  it('should start in the CLOSED state', () => {
    expect(circuitBreaker['state']).toBe(CircuitBreakerState.CLOSED)
  })

  it('should reset failure count and state on success', async () => {
    const successFn = jest.fn().mockResolvedValue('success')

    const result = await circuitBreaker.call(successFn)

    expect(result).toBe('success')
    expect(successFn).toHaveBeenCalled()
    expect(circuitBreaker['state']).toBe(CircuitBreakerState.CLOSED)
    expect(circuitBreaker['failureCount']).toBe(0)
  })

  it('should increment failure count and open the circuit after reaching failure threshold', async () => {
    const failingFn = jest.fn().mockRejectedValue(new Error('failure'))

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    expect(circuitBreaker['state']).toBe(CircuitBreakerState.OPEN)
    expect(circuitBreaker['failureCount']).toBe(options.failureThreshold)
  })

  it('should throw error when circuit is open', async () => {
    const failingFn = jest.fn().mockRejectedValue(new Error('failure'))

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    expect(circuitBreaker['state']).toBe(CircuitBreakerState.OPEN)
    await expect(circuitBreaker.call(failingFn)).rejects.toThrow(
      'Circuit breaker is open',
    )
  })

  it('should move to HALF_OPEN after recoveryTimeout and eventually reset to CLOSED on success', async () => {
    const failingFn = jest.fn().mockRejectedValue(new Error('failure'))
    const successFn = jest.fn().mockResolvedValue('success')

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    try {
      await circuitBreaker.call(failingFn)
    } catch {}

    // Circuit should be OPEN
    expect(circuitBreaker['state']).toBe(CircuitBreakerState.OPEN)

    // Fast-forward time to simulate recoveryTimeout
    jest.advanceTimersByTime(options.recoveryTimeout)

    // Circuit should be HALF_OPEN
    expect(circuitBreaker['state']).toBe(CircuitBreakerState.HALF_OPEN)

    // On success, the circuit should reset to CLOSED
    await circuitBreaker.call(successFn)
    expect(circuitBreaker['state']).toBe(CircuitBreakerState.CLOSED)
  })
})
