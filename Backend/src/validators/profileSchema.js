const Joi = require('joi');

// Validações customizadas
const estadosBrasileiros = [
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

// Schema base para endereço (compartilhado)
const baseAddressSchema = {
  address_type: Joi.string().required().messages({
    'any.required': 'Tipo de endereço é obrigatório',
  }),

  cep: Joi.string().length(8).pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'CEP deve conter apenas números',
    'string.length': 'CEP deve ter 8 dígitos',
    'any.required': 'CEP é obrigatório',
  }),

  street: Joi.string().required().messages({
    'any.required': 'Rua é obrigatória',
  }),

  number: Joi.number().required().messages({
    'any.required': 'Número é obrigatório',
  }),

  complement: Joi.string().allow('').optional(),

  neighbourhood: Joi.string().required().messages({
    'any.required': 'Bairro é obrigatório',
  }),

  city: Joi.string().required().messages({
    'any.required': 'Cidade é obrigatória',
  }),

  state: Joi.string()
    .length(2)
    .valid(...estadosBrasileiros)
    .required()
    .messages({
      'string.length': 'O estado deve ter 2 caracteres (ex: SP)',
      'any.required': 'Estado é obrigatório',
      'any.only': 'Estado inválido',
    }),
};

// Schema para criação de endereço
const AddressCreateSchema = Joi.object(baseAddressSchema);

// Schema para atualização de endereço
const AddressUpdateSchema = Joi.object({
  address_id: Joi.string().uuid().required().messages({
    'string.guid': 'ID do endereço inválido',
    'any.required': 'ID do endereço é obrigatório',
  }),
  address_type: Joi.string().optional(),
  cep: Joi.string().length(8).pattern(/^\d+$/).optional().messages({
    'string.pattern.base': 'CEP deve conter apenas números',
    'string.length': 'CEP deve ter 8 dígitos',
  }),
  street: Joi.string().optional(),
  number: Joi.number().optional(),
  complement: Joi.string().allow('', null).optional(),
  neighbourhood: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string()
    .length(2)
    .valid(...estadosBrasileiros)
    .optional()
    .messages({
      'string.length': 'O estado deve ter 2 caracteres (ex: SP)',
      'any.only': 'Estado inválido',
    }),
}).min(2);

// Schema combinado para endereços
const AddressSchema = Joi.alternatives()
  .try(AddressCreateSchema, AddressUpdateSchema)
  .messages({
    'alternatives.types': 'Formato de endereço inválido',
    'alternatives.match': 'Deve seguir o formato de criação ou atualização',
  });

// Schema principal para atualização de perfil
exports.updateProfileSchema = Joi.object({
  userData: Joi.object({
    cpf: Joi.string()
      .length(11)
      .pattern(/^\d+$/)
      .messages({
        'string.pattern.base': 'CPF deve conter apenas números',
        'string.length': 'CPF deve ter 11 dígitos',
      })
      .optional(),

    birthdate: Joi.date()
      .max(new Date())
      .messages({
        'date.max': 'Data de nascimento inválida',
      })
      .optional(),

    phone: Joi.string()
      .min(10)
      .max(20)
      .messages({
        'string.min': 'Telefone deve ter no mínimo 10 caracteres',
        'string.max': 'Telefone deve ter no máximo 20 caracteres',
      })
      .optional(),

    // Adicione outros campos do usuário conforme necessário
    name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
  }).min(1),

  addressUpdates: Joi.array().items(AddressSchema).optional(),
})
  .or('userData', 'addressUpdates')
  .messages({
    'object.missing': 'Deve fornecer userData ou addressUpdates',
  });

// Schema de validação para o perfil do usuário
exports.profileSchema = Joi.object({
  // Validação do CPF
  cpf: Joi.string()
    .length(11) // Deve ter exatamente 11 caracteres
    .pattern(/^\d+$/) // Deve conter apenas números
    .required() // Campo obrigatório
    .messages({
      'string.pattern.base': 'CPF deve conter apenas números',
      'string.length': 'CPF deve ter 11 dígitos',
      'any.required': 'CPF é obrigatório',
    }),

  // Validação da data de nascimento
  birthdate: Joi.date()
    .max(new Date()) // Data não pode ser no futuro
    .required() // Campo obrigatório
    .messages({
      'date.max': 'Data de nascimento inválida',
      'any.required': 'Data de nascimento é obrigatória',
    }),

  // Validação do telefone
  phone: Joi.string()
    .min(10) // Mínimo de 10 caracteres
    .max(20) // Máximo de 20 caracteres
    .required() // Campo obrigatório
    .messages({
      'string.min': 'Telefone deve ter no mínimo 10 caracteres',
      'string.max': 'Telefone deve ter no máximo 20 caracteres',
      'any.required': 'Telefone é obrigatório',
    }),

  // Validação do endereço
  address: Joi.object({
    address_type: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Tipo de endereço é obrigatório',
      }),

    cep: Joi.string()
      .length(8) // Deve ter exatamente 8 caracteres
      .pattern(/^\d+$/) // Deve conter apenas números
      .required() // Campo obrigatório
      .messages({
        'string.pattern.base': 'CEP deve conter apenas números',
        'string.length': 'CEP deve ter 8 dígitos',
        'any.required': 'CEP é obrigatório',
      }),

    street: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Rua é obrigatória',
      }),

    number: Joi.number()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Número é obrigatório',
      }),

    complement: Joi.string()
      .allow('') // Permite string vazia
      .optional(), // Campo opcional

    neighbourhood: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Bairro é obrigatório',
      }),

    city: Joi.string()
      .required() // Campo obrigatório
      .messages({
        'any.required': 'Cidade é obrigatória',
      }),

    state: Joi.string()
      .length(2) // Deve ter exatamente 2 caracteres
      .required() // Campo obrigatório
      .messages({
        'string.length': 'O estado deve ter 2 caracteres (ex: SP)',
        'any.required': 'Estado é obrigatório',
      }),
  })
    .required() // Endereço é obrigatório
    .messages({
      'any.required': 'Endereço é obrigatório',
    }),
});
