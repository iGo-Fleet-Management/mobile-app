const StopService = require('../services/stopService');

exports.addRoundTripStop = async (req, res) => {
  try {
    // 1. Autenticação e autorização básica
    const userId = req.user.user_id; // Supondo autenticação via middleware JWT
    const { goStop, backStop } = req.body;
    const date = new Date(`${req.body.date}T00:00:00Z`); // ISO 8601 em UTC

    // 2. Validação básica do payload
    if (!date || !goStop || !backStop) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos: date, goStop e backStop são obrigatórios',
      });
    }

    // 3. Chamada do service para adicionar paradas de ida e volta
    const result = await StopService.addRoundTripStop(
      userId,
      new Date(date),
      {
        address_id: goStop.address_id,
        stop_date: new Date(goStop.stop_date),
      },
      {
        address_id: backStop.address_id,
        stop_date: new Date(backStop.stop_date),
      }
    );

    // 4. Resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Paradas de ida e volta configuradas com sucesso',
      data: {
        go: result.goStop,
        back: result.backStop,
      },
    });
  } catch (error) {
    // 5. Tratamento de erros específicos
    const errorMap = {
      'Usuário não encontrado': 404,
      'Endereço não pertence ao usuário': 403,
      'Viagens de ida e/ou volta não encontradas': 404,
      'Data da parada não corresponde': 400,
      'limite máximo de paradas': 409,
    };

    const statusCode = errorMap[error.message] || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Erro ao processar paradas',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
