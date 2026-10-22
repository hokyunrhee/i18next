import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BackendConnector from '../../../src/BackendConnector.js';
import Interpolator from '../../../src/Interpolator.js';
import ResourceStore from '../../../src/ResourceStore.js';

class AlwaysFailingBackend {
  constructor() {
    this.reads = [];
  }

  read(language, namespace, callback) {
    this.reads.push(Date.now());
    callback('failed loading', true); // true = retry
  }
}

const createConnector = (backend, options) =>
  new BackendConnector(backend, new ResourceStore(), { interpolator: new Interpolator() }, options);

const readTimes = async (options) => {
  const backend = new AlwaysFailingBackend();
  const connector = createConnector(backend, options);
  const callback = vi.fn();
  const start = Date.now();

  connector.load(['en'], ['ns'], callback);
  await vi.runAllTimersAsync();

  expect(callback).toHaveBeenCalledWith(['failed loading']);
  return backend.reads.map((t) => t - start);
};

describe('BackendConnector retry backoff', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('doubles the wait between retries when maxRetryTimeout is not set', async () => {
    expect(await readTimes({ maxRetries: 4, retryTimeout: 100 })).toEqual([0, 100, 300, 700, 1500]);
  });

  it('caps the wait between retries at maxRetryTimeout', async () => {
    expect(await readTimes({ maxRetries: 4, retryTimeout: 100, maxRetryTimeout: 250 })).toEqual([
      0, 100, 300, 550, 800,
    ]);
  });

  it('ignores a maxRetryTimeout of 0', async () => {
    expect(await readTimes({ maxRetries: 3, retryTimeout: 100, maxRetryTimeout: 0 })).toEqual([
      0, 100, 300, 700,
    ]);
  });
});
