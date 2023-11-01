import { Component, OnInit } from '@angular/core';
import Web3, { Uint256 } from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { EventEmitter } from '@angular/core';
import { ABI as blockTickEventABI } from 'src/ABI/blockTickEventABI';
import { from } from 'rxjs';

declare let window: any;

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})


export class CreateEventsComponent implements OnInit {
    // Añade un EventEmitter para manejar eventos de error
    errorEvent: EventEmitter<string> = new EventEmitter<string>();

  wallet: any = {
    address: ''
  };
  web3: any;
  contractAddress: string = '0x86C27e65542dB6ab00a82297A97bD3fD6412d2D6'; // dirección del contrato TicketAsset
  walletAddress: string = ''; // la dirección de la billetera del usuario
  ownerAddress?: string; // Define la propiedad ownerAddress aquí
  connectWallet: any;
  contract: any;
  gas: string = '300000';
  network: string = 'Desconocida';
  hash: any;
  transactionHash: string = '';
  transactionMessage: string = ''; // Inicialmente vacío




/**
 * Constructor de la clase TicketsComponent.
 *
 * @param {WalletService} walletService - El servicio de billetera utilizado para interactuar con MetaMask.
 */

  constructor(public walletService: WalletService) { 

    // Inicializa Web3 con el proveedor de MetaMask si está disponible
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(() => {

        // Configura el contrato con su ABI y dirección
        this.contract = new this.web3.eth.Contract(blockTickEventABI.default, this.contractAddress);
      });

 // Asigna un valor a this.ownerAddress, por ejemplo, el primer usuario que se conecta
 this.ownerAddress = this.web3.eth.accounts[0]; // Asegúrate de que esto sea correcto

    } else {
      console.error('MetaMask no está instalado o configurado en el navegador.');
    }
  }


  async ngOnInit() {

    try {
      //await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
      this.wallet = this.walletService.wallet;
      // await this.loadNFTs();
    } catch (error) {
      console.error('Error al inicializar la billetera:', error);
    }
    try {
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
  }
/**
 * 
 * @returns 
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
  
  

  isUserLoggedIn(): boolean {
    if (this.walletService && this.walletService.wallet && this.walletService.wallet.walletAddress) {
      return this.walletService.web3.utils.isAddress(this.walletService.wallet.walletAddress);
    }
    return false;
  }

  disconnectWallet() {
    this.wallet = {
      address: '',
      privateKey: ''
    };
    this.walletService.wallet = this.wallet; 
  }


  async createEvent(_eventName: string, _eventOrganizer: string, _eventCategory: string, _ticketPrice: number) {
    try {
        console.log('Comenzando la función createEvent');

        if (!this.web3 || !this.contract) {
            console.error('Web3 o contrato no están definidos correctamente.');
            return;
        }

        // Verifica que ticketPrice sea un número válido y mayor que cero
        if (isNaN(_ticketPrice) || _ticketPrice <= 0) {
            console.error('El precio del ticket no es válido.');
            return;
        }

        // Convierte el ticketPrice a Wei
        const amountInWei = this.web3.utils.toWei(_ticketPrice.toString(), 'ether');
        console.log('Precio en Wei:', amountInWei);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const ownerAddress = accounts[0]; // Obtiene la dirección activa de MetaMask
        console.log('Dirección de cuenta activa:', ownerAddress);

        console.log('Enviando transacción...');

        // Envía la transacción y recibe el hash de la transacción.
        const transaction: any = await this.contract.methods.createEvent(_eventName, _eventOrganizer, _eventCategory, _ticketPrice).send({
          from: ownerAddress,
          gas: this.gas,
      })
      .on('transactionHash', (hash: string) => {
          this.transactionHash = hash; // Asigna el hash a la propiedad transactionHash
          // Asigna un texto personalizado en lugar del hash
          this.transactionMessage = 'Ver estado de la transacción en Sepolia';


          console.log('Hash de la transacción:', hash);
      });
      

        console.log('Resultado de la transacción:', transaction);

        // Resto del código para llamar a la función del contrato...
    } catch (error: any) {
        console.error('Error al crear el evento:', error);
        this.errorEvent.emit('Error al crear el evento: ' + error.message);
    }
}

  

  async getEventPrice(index: number) {
    try {
      const price = await this.contract.methods.getEventPrice(index).call();

      // Convierte el precio de Wei a Ether para mostrarlo al usuario
      const priceInEther = this.web3.utils.fromWei(price, 'ether');

      console.log(`Precio del evento en el índice ${index}: ${priceInEther} Ether`);
    } catch (error) {
      console.error('Error al obtener el precio del evento:', error);
    }
  }
}