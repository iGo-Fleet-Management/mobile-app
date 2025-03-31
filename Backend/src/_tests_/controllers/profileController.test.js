const userService = require('../../services/userService');
const profileController = require('../../controllers/profileController');

jest.mock('../../services/userService');

describe('Profile Controller - getProfile', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { user_id: '12345' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('Deve retornar o perfil do usuário com sucesso', async () => {
    const mockProfile = {
      id: '12345',
      name: 'Usuário Teste',
      email: 'teste@example.com',
    };
    userService.getProfileById.mockResolvedValue(mockProfile);

    await profileController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockProfile,
    });
  });

  it('Deve retornar erro 404 se o perfil não for encontrado', async () => {
    userService.getProfileById.mockRejectedValue(
      new Error('Perfil não encontrado')
    );

    await profileController.getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'PROFILE_NOT_FOUND',
      message: 'Perfil não encontrado',
    });
  });
});

describe('Profile Controller - completeRegistration', () => {
  let req, res;
  let originalTranslateProfileError;

  beforeEach(() => {
    // Guardar a implementação original antes de mockar
    originalTranslateProfileError = profileController.translateProfileError;

    // Criar o mock para translateProfileError
    profileController.translateProfileError = jest
      .fn()
      .mockReturnValue('Erro traduzido');

    req = {
      user: { user_id: '12345' },
      body: {
        userData: { name: 'Usuário Teste', email: 'teste@example.com' },
        addressUpdates: { street: 'Rua Teste', city: 'Cidade Teste' },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Restaurar a implementação original após cada teste
    profileController.translateProfileError = originalTranslateProfileError;
  });

  it('Deve completar o registro do usuário com sucesso', async () => {
    const mockResult = {
      id: '12345',
      name: 'Usuário Teste',
      email: 'teste@example.com',
      address: { street: 'Rua Teste', city: 'Cidade Teste' },
    };

    userService.saveProfile.mockResolvedValue(mockResult);

    await profileController.completeRegistration(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith(
      '12345',
      req.body.userData,
      req.body.addressUpdates,
      { isInitialCompletion: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResult,
    });
  });

  it('Deve retornar erro 400 se houver erro ao completar o registro', async () => {
    const errorMessage = 'Dados inválidos para completar o registro';
    userService.saveProfile.mockRejectedValue(new Error(errorMessage));

    await profileController.completeRegistration(req, res);

    expect(profileController.translateProfileError).toHaveBeenCalledWith(
      errorMessage
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'PROFILE_COMPLETION_ERROR',
      message: 'Erro traduzido',
    });
  });

  it('Deve passar os dados corretamente para o serviço', async () => {
    const customUserData = { name: 'Nome Customizado', phone: '999999999' };
    const customAddressData = { street: 'Avenida Principal', number: '123' };

    req.body.userData = customUserData;
    req.body.addressUpdates = customAddressData;

    userService.saveProfile.mockResolvedValue({});

    await profileController.completeRegistration(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith(
      '12345',
      customUserData,
      customAddressData,
      { isInitialCompletion: true }
    );
  });
});

describe('Profile Controller - updateProfile', () => {
  let req, res;
  let originalTranslateProfileError;

  beforeEach(() => {
    // Guardar a implementação original antes de mockar
    originalTranslateProfileError = profileController.translateProfileError;

    // Criar o mock para translateProfileError
    profileController.translateProfileError = jest
      .fn()
      .mockReturnValue('Erro traduzido');

    req = {
      user: { user_id: '12345' },
      body: {
        userData: {
          name: 'Usuário Atualizado',
          email: 'atualizado@example.com',
        },
        addressUpdates: { street: 'Rua Atualizada', city: 'Cidade Atualizada' },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    // Restaurar a implementação original após cada teste
    profileController.translateProfileError = originalTranslateProfileError;
  });

  it('Deve atualizar o perfil do usuário com sucesso', async () => {
    const mockResult = {
      id: '12345',
      name: 'Usuário Atualizado',
      email: 'atualizado@example.com',
      address: { street: 'Rua Atualizada', city: 'Cidade Atualizada' },
    };

    userService.saveProfile.mockResolvedValue(mockResult);

    await profileController.updateProfile(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith(
      '12345',
      req.body.userData,
      req.body.addressUpdates
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResult,
    });
  });

  it('Deve retornar erro 404 se o perfil não for encontrado', async () => {
    const errorMessage = 'Perfil não encontrado';
    userService.saveProfile.mockRejectedValue(new Error(errorMessage));

    await profileController.updateProfile(req, res);

    expect(profileController.translateProfileError).toHaveBeenCalledWith(
      errorMessage
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'PROFILE_UPDATE_ERROR',
      message: 'Erro traduzido',
    });
  });

  it('Deve retornar erro 500 para erros gerais', async () => {
    const errorMessage = 'Erro interno do servidor';
    userService.saveProfile.mockRejectedValue(new Error(errorMessage));

    await profileController.updateProfile(req, res);

    expect(profileController.translateProfileError).toHaveBeenCalledWith(
      errorMessage
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      code: 'PROFILE_UPDATE_ERROR',
      message: 'Erro traduzido',
    });
  });

  it('Deve passar apenas os dados informados para o serviço', async () => {
    // Teste com apenas alguns campos atualizados
    const partialUserData = { name: 'Nome Parcial' };
    const partialAddressData = { zipCode: '12345-678' };

    req.body.userData = partialUserData;
    req.body.addressUpdates = partialAddressData;

    userService.saveProfile.mockResolvedValue({});

    await profileController.updateProfile(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith(
      '12345',
      partialUserData,
      partialAddressData
    );
  });

  it('Deve atualizar apenas os dados do usuário sem endereço', async () => {
    req.body = {
      userData: { name: 'Apenas Nome' },
      // Sem addressUpdates
    };

    userService.saveProfile.mockResolvedValue({});

    await profileController.updateProfile(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith(
      '12345',
      { name: 'Apenas Nome' },
      undefined
    );
  });

  it('Deve atualizar apenas o endereço sem dados do usuário', async () => {
    req.body = {
      // Sem userData
      addressUpdates: { street: 'Apenas Endereço' },
    };

    userService.saveProfile.mockResolvedValue({});

    await profileController.updateProfile(req, res);

    expect(userService.saveProfile).toHaveBeenCalledWith('12345', undefined, {
      street: 'Apenas Endereço',
    });
  });
});

// Testes para o translateProfileError
describe('Profile Controller - translateProfileError', () => {
  // Aqui não usamos mocks, testamos a implementação real
  it("Deve traduzir 'User not found' para 'Usuário não encontrado'", () => {
    const errorMessage = 'User not found';
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe('Usuário não encontrado');
  });

  it("Deve traduzir 'Invalid address data' para 'Dados de endereço inválidos'", () => {
    const errorMessage = 'Invalid address data';
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe('Dados de endereço inválidos');
  });

  it("Deve traduzir 'Profile incomplete' para 'Perfil incompleto'", () => {
    const errorMessage = 'Profile incomplete';
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe('Perfil incompleto');
  });

  it('Deve retornar a mensagem original quando não houver tradução', () => {
    const errorMessage = 'Mensagem sem tradução';
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe('Mensagem sem tradução');
  });

  it('Deve lidar com mensagens vazias', () => {
    const errorMessage = '';
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe('');
  });

  it('Deve lidar com valores undefined', () => {
    const errorMessage = undefined;
    const translatedMessage =
      profileController.translateProfileError(errorMessage);

    expect(translatedMessage).toBe(undefined);
  });
});
