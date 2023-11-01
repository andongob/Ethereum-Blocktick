import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as NFTblockTickABI } from 'src/ABI/NFTblockTickABI';
declare let window: any;


@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})

/**
 * Componente de Angular para gestionar la compra de tickets y la interacción con la billetera.
 * Permite a los usuarios comprar boletos y consultar información de la billetera.
 */
export class TicketsComponent implements OnInit {
//Información de la billetera del usuario.
  wallet: any = {
    address: ''
  };  
  web3: any; // Instancia de Web3 utilizada para interactuar con Ethereum y MetaMask.
  walletAddress: string = ''; //Dirección de la billetera del usuario actual.
  ticketAmount: number = 0; //Cantidad de tickets disponibles para comprar.
  ticketPrice: number = 1; //Precio de un boleto en unidades de ether.
  etherAmount: number = 0; //Cantidad de ether en la billetera del usuario.
  contract: any; //Contrato inteligente utilizado para gestionar los tickets.
  transactionResult: string = ''; //Resultado de una transacción reciente, como un mensaje de éxito o error.
  nftContract: any; //Instancia del contrato inteligente NFT utilizado para gestionar los tickets.
  nftContractAddress: any = '0x795398Aa3AE6bF8B4C7a8fef89899ffCA2aE1936'; //Dirección del contrato inteligente NFT utilizado para gestionar los tickets.
  gas: string = '200000'; //Cantidad de gas utilizada en las transacciones de Ethereum.
  network: string = 'Desconocida'; //Red de Ethereum actual a la que está conectido el usuario.
  balanceOf: number = 0; //Cantidad de tickets poseídos por el usuario actual.
  isProcessingTransaction: boolean = false;
  transactionStatus: string = 'ready'; // El valor inicial indica que la transacción está lista para comenzar


/**
 * @function
 * constructor
 * @description
 * Constructor de la clase TicketsComponent.
 *
 * Inicializa una instancia de la clase TicketsComponent.
 *
 * @param {WalletService} walletService - Servicio de billetera utilizado para interactuar con Metamask.
 */
constructor(public walletService: WalletService) {
  // Inicializa una instancia de Web3 con el proveedor de Infura si está disponible.
  this.web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));

  // Inicializa una instancia del contrato NFTblockTick utilizando su ABI y dirección.
  this.nftContract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);

  // También inicializa una instancia del contrato para otros propósitos.
  this.contract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);

  // Inicializa la propiedad wallet con una dirección y clave privada en blanco.
  this.wallet = {
    address: '',
    privateKey: ''
  };

  // Imprime el contrato NFTblockTick en la consola para depuración.
  console.log('nftContract:', this.nftContract);
}



/**
 * @function 
 * ngOnInit
 * @description
 * Método de ciclo de vida de Angular que se ejecuta cuando el componente se inicia.
 * Realiza la inicialización necesaria de datos y propiedades al cargar el componente.
 * @returns {void} No devuelve ningún valor específico.
 */
async ngOnInit(): Promise<void> {
      // Llama a la función para verificar la red
      this.walletService.checkNetwork();
  try {
    // Inicializa la billetera utilizando una semilla (comentada en el código).
    //await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
    
    // Asigna la billetera del servicio a la propiedad wallet del componente.
    this.wallet = this.walletService.wallet;
  } catch (error) {
    console.error('Error al inicializar la billetera:', error);
  }
  try {
    // Obtiene la identificación de la red actual y la asigna a la propiedad network.
    const networkId = await this.getNetworkId();
    if (networkId !== null) {
      this.network = networkId.toString();
    } else {
      this.network = 'Desconocido';
    }
  } catch (error) {
    console.error('Error al inicializar la red:', error);
    this.network = 'Desconocido';
  }
  
  // Verifica si el usuario ha iniciado sesión y, en ese caso, asigna la dirección de la billetera al walletAddress.
  if (this.isUserLoggedIn()) {
    this.walletAddress = this.walletService.wallet.walletAddress;
  }
}


/**
 * @función 
 * getNetworkId 
 * @description Esta función utiliza Web3 para obtener el ID de la red Ethereum a la que está conectida la aplicación.
 * @async Indica que esta función es asincrónica y puede realizar operaciones de red asincrónicas. *
 * @returns {Promise<number | null>} Devuelve un número que representa el ID de la red si se obtiene con éxito, o null si ocurre un error.
 */
async getNetworkId() {
  try {
    const networkId = await this.web3.eth.net.getId();
    return networkId;
  } catch (error) {
    console.error('Error al obtener la versión de la red:', error);
    return null;
  }
}


/**
 * Obtiene el nombre de la red actual a través de Web3.
 *
 * @función Esta función se encarga de obtener el nombre de la red Ethereum a la que está conectida la aplicación,
 *         y lo devuelve como un valor legible para los usuarios.
 * @async Indica que esta función es asincrónica y puede realizar operaciones de red asincrónicas.
 *
 * @returns {Promise<string>} Devuelve una cadena que representa el nombre de la red Ethereum:
 *   - 'Mainnet' para la red principal de Ethereum.
 *   - 'Ropsten' para la red de prueba Ropsten.
 *   - 'Rinkeby' para la red de prueba Rinkeby.
 *   - 'Kovan' para la red de prueba Kovan.
 *   - 'Desconocida' si no se puede determinar la red o se produce un error.
 */
async getNetwork(): Promise<string> {
  try {
    const networkId = await this.web3.eth.net.getId();
    switch (networkId) {
      case 1:
        return 'Mainnet';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 42:
        return 'Kovan';
      default:
        return 'Desconocida';
    }
  } catch (error) {
    console.error('Error al obtener la versión de la red:', error);
    return 'Desconocida';
  }
}




/**
 * Comprueba si un usuario está actualmente conectado.
 *
 * @función Esta función se utiliza para determinar si un usuario ha iniciado sesión y está conectado.
 * @description Comprueba si el servicio de billetera (`walletService`) está definido y si contiene una billetera válida con una dirección.
 * @returns {boolean} Devuelve `true` si el usuario está conectado y `false` si no lo está.
 */
isUserLoggedIn(): boolean {
  if (this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress) {
    return this.walletService.web3.utils.isAddress(this.walletService.wallet.walletAddress);
  }
  return false;
}


/**
 * Desconecta la billetera actual del servicio y restablece la información de la billetera.
 *
 * @función Esta función se utiliza para cerrar la sesión del usuario y restablecer la información de la billetera.
 * @description Establece la dirección y la clave privada de la billetera actual en valores vacíos, lo que efectivamente cierra la sesión del usuario.
 * @returns {void} No devuelve ningún valor.
 */
disconnectWallet() {
  this.wallet = {
    address: '',
    privateKey: ''
  };
  this.walletService.wallet = this.wallet; 
}

  

 /**
 * Realiza una compra de tickets mediante MetaMask y Ethereum.
 *
 * @función Esta función permite a un usuario comprar un ticket para un evento a través de MetaMask y Ethereum.
 * @description Obtiene el precio de un ticket y el número de tickets a comprar, luego calcula el valor en wei necesario para la transacción.
 * Luego verifica si el usuario está conectado a MetaMask y tiene una cuenta seleccionada. Si no, muestra un mensaje de error y sale de la función.
 * Si el usuario está conectado, construye una transacción que incluye la dirección de envío, el valor y los datos necesarios para comprar el ticket en el contrato inteligente.
 * Finalmente, solicita a MetaMask que firme y envíe la transacción y muestra el resultado en la consola.
 * 
 * @returns {void} No devuelve ningún valor.
 */
async buyTickets() {
  // Obtiene el valor del precio del ticket y el número de tickets de las propiedades del componente
  const ticketPrice = await this.nftContract.methods.ticketPrice().call();
  const amount = 1; // Comprar 1 ticket

  // Calcula el valor en wei necesario
  const value = ticketPrice * amount;

  try {
    if (!window.ethereum || !window.ethereum.selectedAddress) {
      console.error('No se encontró una cuenta conectada en MetaMask.');
      return;
    }

    const fromAddress = window.ethereum.selectedAddress;

    // Transacción
    const tx = {
      from: fromAddress,
      to: this.nftContractAddress,
      value: value,
      gas: this.gas, // Asegúrate de que gas sea un valor adecuado
      data: this.nftContract.methods.buyTickets(fromAddress, amount).encodeABI()
    };

    // Solicita a MetaMask que firme y envíe la transacción
    const result = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });

    console.log('Resultado de la compra de tickets:', result);
  } catch (error) {
    console.error('Error al comprar tickets:', error);
  }
}

  

/**
 * @función
 *
 * @descripción Compra un ticket para el usuario actual mediante MetaMask y Ethereum.
 *
 * Esta función permite al usuario comprar un ticket para el evento actual a través de MetaMask y Ethereum.
 * Obtiene el precio de un ticket, verifica si el usuario está conectado a MetaMask y tiene una cuenta seleccionada.
 * Si el usuario está conectado y no tiene ningún NFT para este evento, genera una transacción para comprar un ticket y la envía a través de MetaMask.
 * Si el usuario ya tiene un NFT para este evento, muestra un mensaje en la consola.
 * Si el usuario no está conectado a MetaMask o MetaMask no está instalado, muestra un mensaje de error.
 *
 * @returns {void} No devuelve ningún valor.
 *
 * @remarks Asegúrate de que MetaMask esté instalado y configurado en el navegador antes de llamar a esta función.
 * Esta función cambia el estado de la transacción, que puede ser "processing", "success", "user_denied", "canceled" o "error".
 */
async buyOneTicketForMe() {

  if (this.isProcessingTransaction) {
    return; // Evita que el usuario haga múltiples clics mientras se procesa la transacción
  }

  this.isProcessingTransaction = true;


 try {
    // Verifica si window y window.ethereum están disponibles
  if (typeof window !== 'undefined' && 'ethereum' in window) {
  const ethereum = window['ethereum'];

  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log('Accounts:', accounts);

  if (accounts.length === 0) {
    console.error('El usuario no aprobó la transacción.');
    return;
  }

  const fromAddress = accounts[0];

  // cantidad de NFTs que el usuario posee
  const nftBalance = await this.nftContract.methods.balanceOf(fromAddress).call();
  this.balanceOf = parseInt(nftBalance);
  console.log('BalanceOf:', this.balanceOf);

  if (parseInt(nftBalance) === 0) {
    console.log('El usuario no tiene NFTs para este evento. Puede comprar un ticket.');

// Convierte el precio del ticket a una cadena hexadecimal
const value = this.web3.utils.toHex(this.ticketPrice);

interface Transaction {
  from: string;
  to: string;
  value: string;
  gas: string;
  data: string;
}
    const tx: Transaction = {
      from: fromAddress,
      to: this.nftContractAddress,
      value: value,
      gas: this.gas,
      data: this.nftContract.methods.buyOneTicketForMe().encodeABI()
    };

    this.transactionStatus = 'processing'; // Cambia el estado a "procesando"

    // Envía la transacción a través de MetaMask
    const result = await ethereum.request({ method: 'eth_sendTransaction', params: [tx]});
    console.log('Resultado de la compra de un NFT para el usuario actual:', result);

    if (result) {
      this.transactionStatus = 'success'; // Cambia el estado a "éxito" si la transacción se completó con éxito
    }

  } else {
    console.log('El usuario YA tiene un NFT para este evento.');
  }
} else {
  console.error('MetaMask no está instalado o configurado en el navegador.');
}} 
catch (error: any) {
  if (error.message === 'User denied transaction') {
    console.error('El usuario denegó la transacción.');
    this.transactionStatus = 'user_denied'; // Cambia el estado a "usuario denegó"
  } 
  
  else if (error.code === 4001) {
    console.error('El usuario canceló la transacción.');
    this.transactionStatus = 'canceled'; // Cambia el estado a "cancelado por el usuario"
  } 
  
  else {
    console.error('Error al comprar un NFT para el usuario actual:', error);
    this.transactionStatus = 'error'; // Cambia el estado a "error"
    // En caso de error, asegúrate de restablecer isProcessingTransaction aquí también
    this.isProcessingTransaction = false;
  }
}
}

}





  
