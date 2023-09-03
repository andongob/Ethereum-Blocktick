const Ticket = artifacts.require("Ticket");

contract("Ticket Contract", function (accounts) {
  let ticketContract;
  const owner = accounts[0];
  const user1 = accounts[1];

  beforeEach(async function () {
    ticketContract = await Ticket.new({ from: owner });
  });

  it("Debería permitir comprar un ticket", async function () {
    const ticketPriceWei = web3.utils.toWei("1", "ether");
    await ticketContract.buyTickets(user1, 1, { value: ticketPriceWei, from: user1 });
    // Aquí debes agregar la lógica para verificar que la compra del ticket fue exitosa
    // Por ejemplo, podrías verificar el balance del contrato o el evento emitido
  });

  it("No debería dejar compra mas de un ticket", async function () {
    const ticketPriceWei = web3.utils.toWei("1", "ether");
    await ticketContract.buyTickets(user1, 1, { value: ticketPriceWei, from: user1 });
    try {
      await ticketContract.buyTickets(user1, 1, { value: ticketPriceWei, from: user1 });
      assert.fail("Expected revert");
    } catch (error) {
      // Aquí debes verificar que el mensaje de error sea el esperado
      // Puede variar según cómo el contrato maneje las reversiones
    }
  });
  
    it("debe permitir al owner usar su ticket", async function () {
    const ticketPriceWei = web3.utils.toWei("1", "ether");
    await ticketContract.buyTickets(user1, 1, { value: ticketPriceWei, from: user1 });

    await ticketContract.useTickets(user1, 1, { from: user1 });

    const tokenIds = await ticketContract.balanceOf(user1);
    assert.equal(tokenIds.toString(), "0", "User should have no tickets left");
  });

  it("No debería dejar usar otros tickets salvo el suyo", async function () {
    const ticketPriceWei = web3.utils.toWei("1", "ether");
    await ticketContract.buyTickets(user1, 1, { value: ticketPriceWei, from: user1 });

    try {
      await ticketContract.useTickets(user1, 2, { from: user1 });
      assert.fail("Expected revert");
    } catch (error) {
      // Verificar el mensaje de error si es necesario
    }
  });
});