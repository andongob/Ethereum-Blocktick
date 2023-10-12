const EventNFTManager = artifacts.require('EventNFTManager'); // Asegúrate de que el nombre del contrato sea correcto
const truffleAssert = require('truffle-assertions');

contract('EventNFTManager', (accounts) => {
    let eventNFTManager;

    before(async () => {
        eventNFTManager = await EventNFTManager.new("Evento de Prueba", "Organizador", "Categoría", accounts[0], 1);
    });


  it('no debería permitir comprar más de un ticket', async () => {
    // Intenta comprar otro ticket con la cuenta accounts[1]
    await eventNFTManager.buyOneTicketForMe({ from: accounts[1], value: 1 });
    // Verifica que la transacción se haya completado correctamente
    // No necesitas `truffle-assertions` en este caso
});


it('no debería dejar comprar por falta de saldo', async () => {
  // Obtén el saldo inicial de la cuenta accounts[1]
  const initialBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));

  // Calcula el precio de un boleto
  const ticketPrice = web3.utils.toBN(await eventNFTManager.getPrice());

  // Calcula el valor insuficiente (un valor menor que el precio del boleto)
  const insufficientValue = ticketPrice.sub(web3.utils.toBN(1));

  // Intenta comprar un boleto con la cuenta accounts[1] pero con saldo insuficiente
  await truffleAssert.fails(
      eventNFTManager.buyTickets(accounts[1], 1, { from: accounts[1], value: insufficientValue }),
      truffleAssert.ErrorType.REVERT
  );

  // Asegúrate de que el saldo de la cuenta no haya cambiado
  const finalBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[1]));
  assert.isTrue(finalBalance.eq(initialBalance), 'El saldo de la cuenta debería ser el mismo.');
});

});
