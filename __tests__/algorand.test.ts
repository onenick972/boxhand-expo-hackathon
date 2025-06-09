import algosdk from 'algosdk';
import { isValidAlgorandAddress } from '../lib/algorand';

describe('isValidAlgorandAddress', () => {
  it('returns true for a valid Algorand address', () => {
    const { addr } = algosdk.generateAccount();
    expect(isValidAlgorandAddress(addr)).toBe(true);
  });

  it('returns false for an address with an invalid checksum', () => {
    const { addr } = algosdk.generateAccount();
    const modified = addr.slice(0, -1) + (addr.slice(-1) === 'A' ? 'B' : 'A');
    expect(isValidAlgorandAddress(modified)).toBe(false);
  });

  it('returns false for clearly invalid input', () => {
    expect(isValidAlgorandAddress('notARealAddress')).toBe(false);
    expect(isValidAlgorandAddress('')).toBe(false);
  });
});
