/**
 * CPF (Cadastro de Pessoas Físicas) Validator
 * Brazilian tax identification number validation
 */
export class CpfValidator {
  /**
   * Remove non-numeric characters from CPF
   */
  private static clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  /**
   * Check if all digits are the same (invalid CPF)
   */
  private static hasAllSameDigits(cpf: string): boolean {
    return /^(\d)\1{10}$/.test(cpf);
  }

  /**
   * Calculate CPF check digit
   */
  private static calculateCheckDigit(cpf: string, position: number): number {
    let sum = 0;
    let weight = position;

    for (let i = 0; i < position - 1; i++) {
      sum += parseInt(cpf.charAt(i)) * weight;
      weight--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  /**
   * Validate CPF using the official algorithm
   */
  static validate(cpf: string): boolean {
    if (!cpf) {
      return false;
    }

    // Clean CPF (remove dots, dashes, etc.)
    const cleanedCpf = this.clean(cpf);

    // Check if has 11 digits
    if (cleanedCpf.length !== 11) {
      return false;
    }

    // Check if all digits are the same (invalid CPF)
    if (this.hasAllSameDigits(cleanedCpf)) {
      return false;
    }

    // Validate first check digit (position 10)
    const firstCheckDigit = this.calculateCheckDigit(cleanedCpf, 10);
    if (firstCheckDigit !== parseInt(cleanedCpf.charAt(9))) {
      return false;
    }

    // Validate second check digit (position 11)
    const secondCheckDigit = this.calculateCheckDigit(cleanedCpf, 11);
    if (secondCheckDigit !== parseInt(cleanedCpf.charAt(10))) {
      return false;
    }

    return true;
  }

  /**
   * Format CPF with standard mask: 000.000.000-00
   */
  static format(cpf: string): string {
    const cleaned = this.clean(cpf);
    if (cleaned.length !== 11) {
      return cpf;
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  /**
   * Generate a random valid CPF (useful for testing)
   */
  static generate(): string {
    // Generate first 9 digits randomly
    const randomDigits = Array.from({ length: 9 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');

    // Calculate first check digit
    const firstCheckDigit = this.calculateCheckDigit(randomDigits, 10);
    const withFirstCheck = randomDigits + firstCheckDigit;
    
    // Calculate second check digit
    const secondCheckDigit = this.calculateCheckDigit(withFirstCheck, 11);

    return withFirstCheck + secondCheckDigit;
  }
}
