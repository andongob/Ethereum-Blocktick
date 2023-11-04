import { Component } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as blockTickEventABI } from 'src/ABI/blockTickEventABI';

declare let window: any;

/**
 * Componente CreateEventsComponent.
 * 
 * Este componente se utiliza para crear eventos enviando transacciones a un contrato inteligente en Ethereum.
 */
@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})


export class CreateEventsComponent {

  wallet: any = { //Información sobre la billetera del usuario.
    address: ''
  };
  contractAddress: string = '0x387B70DEe5FAE65a384d60691De758f1dD1343B3';//La dirección del contrato para la creación de eventos.
  ownerAddress: string | undefined = '';//La dirección Ethereum del propietario.
  web3: Web3 | undefined;//Instancia Web3 utilizada para interactuar con Ethereum.
  contract: any;//Instancia del contrato utilizado para la creación de eventos.
  _eventName: string = '';//El nombre del evento.
  _eventOrganizer: string = '';//El organizador del evento.
  _eventCategory: string = '';//La categoría del evento.
  _ticketPrice: number = 0; //El precio de los boletos del evento (inicializado con un valor predeterminado).
  gas: string = '6000000';//El límite de gas para las transacciones.
  transactionHash: string = '';//El hash de la transacción.
  transactionMessage: string = '';//Mensaje de la transacción.

/**
 * Constructor de CreateEventsComponent.
 *
 * Inicializa una nueva instancia de CreateEventsComponent.
 * @param walletService - Una instancia de WalletService para la gestión de billeteras.
 *
 * Este constructor realiza las siguientes acciones:
 * - Inicializa una instancia de Web3 con el proveedor de Infura si está disponible.
 * - Inicializa la propiedad de billetera con una dirección y clave privada en blanco.
 * - Verifica la presencia de MetaMask y configura Web3 en consecuencia.
 * - Inicializa la instancia de contrato para la interacción con la cadena de bloques.
 */
constructor(public walletService: WalletService) {
  // @param walletService - Una instancia de WalletService para la gestión de billeteras.

  /**
   * Inicializa una instancia de Web3 con el proveedor de Infura si está disponible.
   * @description Esta instancia de Web3 se utilizará para interactuar con la cadena de bloques Ethereum.
   */
  this.web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));

  /**
   * Inicializa la propiedad de billetera con una dirección y clave privada en blanco.
   * @description Esta propiedad contiene información relacionada con la billetera del usuario, como la dirección y la clave privada.
   */
  this.wallet = {
    address: '',
    privateKey: ''
  };

  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Verifica si la ventana del navegador y el proveedor Ethereum (MetaMask) están disponibles.

    // Inicializa la instancia de Web3 con el proveedor Ethereum del usuario.
    this.web3 = new Web3(window.ethereum);

    // Habilita el proveedor Ethereum y realiza acciones después de habilitarlo.
    window.ethereum.enable().then(() => {
      /**
       * Inicializa la instancia de contrato para interactuar con la cadena de bloques.
       * @description Esta instancia de contrato se utilizará para llamar funciones e interactuar con el contrato inteligente en la cadena de bloques.
       * @param blockTickEventABI - El ABI (Interfaz Binaria de Aplicación) del contrato inteligente.
       * @param contractAddress - La dirección del contrato inteligente.
       */
      this.contract = new this.web3!.eth.Contract(blockTickEventABI.default, this.contractAddress);
    });

    // Llama a la función para obtener la dirección del propietario.
    this.getOwnerAddress(); // Llamada a la función para obtener la dirección del propietario
  } else {
    // Si MetaMask no está instalado o configurado, muestra un mensaje de error.
    console.error('MetaMask no está instalado o configurado en el navegador.');
  }
}



/**
 * Inicializa el componente al cargar la página.
 *
 * Este método se encarga de realizar las tareas de inicialización del componente, como la creación y asignación de una billetera.
 *
 * @async
 */
async ngOnInit() {
  try {
    if (!this.walletService.wallet || !this.walletService.wallet.walletAddress) {
      /**
       * Inicializa el servicio de billetera con una frase mnemotécnica.
       * @param mnemonic - La frase mnemotécnica utilizada para generar una billetera.
       */
      await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
    }

    // Asigna la información de la billetera a la propiedad wallet del componente.
    this.wallet = this.walletService.wallet;
  } catch (error) {
    // Maneja y registra cualquier error que ocurra durante la inicialización.
    console.error('Error al inicializar la billetera:', error);
  }
}


/**
 * Crea un nuevo evento enviando una transacción al contrato inteligente.
 *
 * Este método inicia el proceso de creación de un nuevo evento enviando una transacción al contrato inteligente.
 * Realiza las siguientes acciones:
 * - Verifica si la dirección del propietario está definida y registra un error si no lo está.
 * - Asegura que la instancia de Web3 esté correctamente inicializada y registra un error si no lo está.
 * - Obtiene la dirección del propietario.
 * - Inicializa la función createEvent del contrato.
 * - Estima el gas requerido para la transacción.
 * - Convierte el precio del boleto a hexadecimal y lo asigna como valor de la transacción.
 * - Envía la transacción para crear el evento.
 *
 * @async
 */
async createEvent() {
  try {
    if (!this.ownerAddress) {
      console.error('La dirección del propietario no está definida.');
      return;
    }

    // Asegura que this.web3 esté correctamente inicializado.
    if (!this.web3) {
      console.error('web3 no está inicializado correctamente.');
      return;
    }

    // Obtiene la dirección del propietario.
    const accounts = await this.web3!.eth.getAccounts();
    this.ownerAddress = accounts[0];

    // Inicializa la función createEvent del contrato.
    const createEventFunction = this.contract.methods.createEvent;

    // Encuentra la firma ABI de la función createEvent.
    const abiCreateEvent = this.contract.options.jsonInterface.find(
      (item: any) =>
        item.name === 'createEvent' &&
        item.type === 'function' &&
        item.inputs.length === 4
    );

    // Estima el gas requerido para la transacción.
    const gasEstimación = await this.contract.methods.createEvent(
      this._eventName,
      this._eventOrganizer,
      this._eventCategory,
      this._ticketPrice
    ).estimateGas({ from: this.ownerAddress });

    console.log('Estimación de gas:', gasEstimación);

    // Antes de ejecutar la transacción.
    console.log('Realizando la transacción...');

    // Convierte el precio del boleto a hexadecimal y lo asigna como valor de la transacción.
    const ticketPriceInWei = this.web3.utils.toWei(this._ticketPrice.toString(), 'ether');
    const valor = this.web3.utils.toHex(ticketPriceInWei);

    // Envía la transacción para crear el evento.
    const transacción = await this.contract.methods.createEvent(
      this._eventName,
      this._eventOrganizer,
      this._eventCategory,
      this._ticketPrice
    ).send({
      from: this.ownerAddress,
      to: this.contractAddress, // Agregar la dirección del contrato como "to"
      gas: this.gas,
      data: this.contract.methods.createEvent(this._eventName, this._eventOrganizer, this._eventCategory, this._ticketPrice).encodeABI()
    })
      .on('transactionHash', (hash: string) => {
        this.transactionHash = hash;
        this.transactionMessage = 'Ver estado de la transacción en Sepolia';
        console.log('Hash de la transacción:', hash);
      });

    console.log('Transacción exitosa:', transacción);
  } catch (error) {
    console.error('Error al crear el evento:', error);
  }
}

  
  
/**
 * Obtiene y actualiza la dirección del propietario.
 *
 * Este método recupera la dirección del propietario mediante el uso de Web3 y la actualiza en la propiedad `ownerAddress`.
 *
 * @async
 */
async getOwnerAddress() {
  // Obtiene las cuentas disponibles a través de Web3.
  const accounts = await this.web3!.eth.getAccounts();

  // Actualiza la dirección del propietario con la primera cuenta obtenida.
  this.ownerAddress = accounts[0];
}

}