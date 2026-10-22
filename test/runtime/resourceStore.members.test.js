import { describe, it, expect } from 'vitest';
import ResourceStore from '../../src/ResourceStore.js';

const data = () => ({
  en: { translation: { a: 'A' }, common: { b: 'B' } },
  de: { translation: { a: 'Ä' } },
});

describe('ResourceStore members', () => {
  it('lists the languages it holds', () => {
    expect(new ResourceStore(data()).languages).toEqual(['en', 'de']);
  });

  it('lists the namespaces of a language', () => {
    const store = new ResourceStore(data());
    expect(store.getNamespaces('en')).toEqual(['translation', 'common']);
    expect(store.getNamespaces('fr')).toEqual([]);
  });

  it('exposes the default namespace', () => {
    const store = new ResourceStore(data(), { ns: ['translation'], defaultNS: 'common' });
    expect(store.defaultNamespace).toBe('common');
  });

  it('fromJSON creates a store from a copy of the data', () => {
    const source = data();
    const store = ResourceStore.fromJSON(source);
    expect(store.getResource('en', 'translation', 'a')).toBe('A');

    store.addResource('en', 'translation', 'a', 'changed');
    expect(source.en.translation.a).toBe('A');
  });
});
