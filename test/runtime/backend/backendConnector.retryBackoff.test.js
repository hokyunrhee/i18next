import { describe, it, expect } from 'vitest';
import BackendConnector from '../../../src/BackendConnector.js';
import Interpolator from '../../../src/Interpolator.js';
import ResourceStore from '../../../src/ResourceStore.js';

class AlwaysFailingBackend {
  read(language, namespace, callback) {
    callback('failed loading', true); // true = retry
  }
}

describe('BackendConnector retry backoff', () => {
  it('gives up after maxRetries when maxRetryTimeout is set', async () => {
    const connector = new BackendConnector(
      new AlwaysFailingBackend(),
      new ResourceStore(),
      { interpolator: new Interpolator() },
      { maxRetries: 2, retryTimeout: 1, maxRetryTimeout: 2 },
    );

    const err = await new Promise((resolve) => {
      connector.load(['en'], ['ns'], resolve);
    });

    expect(err).toBeTruthy();
  });
});
