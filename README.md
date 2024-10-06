# Circuit-Breaker

This repository contains the implementation and documentation of a Circuit Breaker pattern for managing fault tolerance in centralized and distributed systems.

## Features

- Implements the Circuit Breaker pattern to handle failures and timeouts in centralized systems.
- Manages transitions between CLOSED, OPEN, and HALF_OPEN states.


## Test Coverage

**Test coverage for this package is currently at 100%.** This ensures that all features and functionalities are thoroughly tested.


## Note

Currently, the Circuit Breaker implementation supports centralized systems. In future versions, support for distributed systems will be added, including features such as:

- Distributed state management for the circuit breaker.
- Enhanced monitoring and metrics aggregation across multiple nodes.
- Coordination between services in different environments.

Stay tuned for updates as we work on adding these features!


## Installation

To install the Circuit Breaker package, run the following command:

```bash
npm install circuit-breaker-lib
```


## Usage Example

Here’s a simple example of how to use the Circuit Breaker in your TypeScript project:

```typescript
import {CircuitBreaker} from 'circuit-breaker-lib';

const circuitBreaker = new CircuitBreaker({
    failureThreshold: 3,
    recoveryTimeout: 5000,
  });
  
  async function riskyOperation() {
    // Replace with actual operation, e.g., an HTTP request
    throw new Error('Failed operation');
  }
  
  async function execute() {
    try {
      const result = await circuitBreaker.call(riskyOperation);
      console.log(result);
    } catch (error: any) {
      console.error('Operation failed:', error.message);
    }
  }
  
  execute();
```