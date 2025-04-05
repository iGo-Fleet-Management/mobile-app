const UserRepository = require('../../repositories/userRepository');
const AddressRepository = require('../../repositories/addressRepository');
const TripRepository = require('../../repositories/tripRepository');
const { Stop } = require('../../models');

exports.validateStopRelations = async (stopData, transaction) => {
  // 1. Buscar entidades relacionadas
  const [user, address, trip] = await Promise.all([
    UserRepository.findById(stopData.user_id, { transaction }),
    AddressRepository.findById(stopData.address_id, { transaction }),
    TripRepository.findById(stopData.trip_id, {
      transaction,
      include: [{ model: Stop, as: 'stops' }],
    }),
  ]);

  // 2. Validações básicas de existência
  if (!user) throw new Error('Usuário não encontrado');
  if (!address) throw new Error('Endereço não encontrado');
  if (!trip) throw new Error('Viagem não encontrada');

  // 3. Validação de propriedade do endereço
  if (address.user_id !== stopData.user_id) {
    throw new Error('Endereço não pertence ao usuário');
  }

  // 4. Validação específica da viagem
  const stopDate = new Date(stopData.stop_date);
  const tripDate = new Date(trip.trip_date);

  // Converter para formato ISO e extrair a parte da data (YYYY-MM-DD)
  const stopDateStr = stopDate.toISOString().split('T')[0];
  const tripDateStr = tripDate.toISOString().split('T')[0];

  if (stopDateStr !== tripDateStr) {
    throw new Error('Data da parada não corresponde à data da viagem');
  }

  // 5. Validação de capacidade da viagem
  if (trip.stops && trip.stops.length >= 25) {
    throw new Error('Viagem atingiu o limite máximo de paradas');
  }
};
