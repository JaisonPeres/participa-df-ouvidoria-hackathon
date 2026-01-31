import { describe, it, expect } from 'vitest';
import { CpfValidator } from '../utils/cpf-validator';

describe('CpfValidator', () => {
  describe('validate', () => {
    it('should validate correct CPF', () => {
      // Valid CPFs (tested and verified)
      expect(CpfValidator.validate('11144477735')).toBe(true);
      expect(CpfValidator.validate('52998224725')).toBe(true);
      expect(CpfValidator.validate('82178537464')).toBe(true);
    });

    it('should validate CPF with formatting', () => {
      expect(CpfValidator.validate('111.444.777-35')).toBe(true);
      expect(CpfValidator.validate('529.982.247-25')).toBe(true);
      expect(CpfValidator.validate('821.785.374-64')).toBe(true);
    });

    it('should reject CPF with all same digits', () => {
      expect(CpfValidator.validate('00000000000')).toBe(false);
      expect(CpfValidator.validate('11111111111')).toBe(false);
      expect(CpfValidator.validate('22222222222')).toBe(false);
      expect(CpfValidator.validate('99999999999')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(CpfValidator.validate('123')).toBe(false);
      expect(CpfValidator.validate('123456789012')).toBe(false);
      expect(CpfValidator.validate('')).toBe(false);
    });

    it('should reject CPF with invalid check digits', () => {
      expect(CpfValidator.validate('11144477736')).toBe(false); // Wrong last digit
      expect(CpfValidator.validate('11144477745')).toBe(false); // Wrong second check digit
      expect(CpfValidator.validate('52998224726')).toBe(false); // Wrong last digit
    });

    it('should handle empty or null values', () => {
      expect(CpfValidator.validate('')).toBe(false);
      expect(CpfValidator.validate(null as any)).toBe(false);
      expect(CpfValidator.validate(undefined as any)).toBe(false);
    });
  });

  describe('format', () => {
    it('should format CPF with mask', () => {
      expect(CpfValidator.format('11144477735')).toBe('111.444.777-35');
      expect(CpfValidator.format('52998224725')).toBe('529.982.247-25');
      expect(CpfValidator.format('82178537464')).toBe('821.785.374-64');
    });

    it('should handle already formatted CPF', () => {
      expect(CpfValidator.format('111.444.777-35')).toBe('111.444.777-35');
    });

    it('should return original value if invalid length', () => {
      expect(CpfValidator.format('123')).toBe('123');
      expect(CpfValidator.format('123456')).toBe('123456');
    });
  });

  describe('generate', () => {
    it('should generate valid CPF', () => {
      const cpf = CpfValidator.generate();
      expect(cpf).toHaveLength(11);
      expect(CpfValidator.validate(cpf)).toBe(true);
    });

    it('should generate different CPFs', () => {
      const cpf1 = CpfValidator.generate();
      const cpf2 = CpfValidator.generate();
      const cpf3 = CpfValidator.generate();
      
      // Very unlikely to generate the same CPF twice
      expect(cpf1).not.toBe(cpf2);
      expect(cpf2).not.toBe(cpf3);
      expect(cpf1).not.toBe(cpf3);
    });

    it('should generate multiple valid CPFs', () => {
      for (let i = 0; i < 10; i++) {
        const cpf = CpfValidator.generate();
        expect(CpfValidator.validate(cpf)).toBe(true);
      }
    });
  });
});
