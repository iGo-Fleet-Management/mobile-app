// config/brazilianStates.js

/**
 * Módulo de configuração para estados brasileiros
 * Centraliza a lista de estados e fornece métodos de validação
 */
class BrazilianStates {
  // Lista oficial de estados brasileiros
  static list = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];

  /**
   * Valida se um estado é válido
   * @param {string} state - Sigla do estado
   * @returns {boolean} - Se o estado é válido
   */
  static isValid(state) {
    return this.list.includes(state.toUpperCase());
  }

  /**
   * Obtém nome completo do estado
   * @param {string} abbreviation - Sigla do estado
   * @returns {string|null} - Nome do estado ou null
   */
  static getFullName(abbreviation) {
    const stateNames = {
      AC: 'Acre',
      AL: 'Alagoas',
      AP: 'Amapá',
      AM: 'Amazonas',
      BA: 'Bahia',
      CE: 'Ceará',
      DF: 'Distrito Federal',
      ES: 'Espírito Santo',
      GO: 'Goiás',
      MA: 'Maranhão',
      MT: 'Mato Grosso',
      MS: 'Mato Grosso do Sul',
      MG: 'Minas Gerais',
      PA: 'Pará',
      PB: 'Paraíba',
      PR: 'Paraná',
      PE: 'Pernambuco',
      PI: 'Piauí',
      RJ: 'Rio de Janeiro',
      RN: 'Rio Grande do Norte',
      RS: 'Rio Grande do Sul',
      RO: 'Rondônia',
      RR: 'Roraima',
      SC: 'Santa Catarina',
      SP: 'São Paulo',
      SE: 'Sergipe',
      TO: 'Tocantins',
    };
    return stateNames[abbreviation.toUpperCase()] || null;
  }
}

module.exports = BrazilianStates;
