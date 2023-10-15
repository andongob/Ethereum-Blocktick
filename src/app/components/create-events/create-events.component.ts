import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as factoryABI } from 'src/ABI/blockTickEventABI';

declare let window: any;

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})
export class CreateEventsComponent implements OnInit {
  wallet: any = {
    address: ''
  };
  web3: any;
  contractAddress: string = '0xDb885a7cd58aD7cA96fAb45A0F8574140627002B'; // dirección del contrato TicketAsset
  walletAddress: string = ''; // la dirección de la billetera del usuario
  connectWallet: any;
  contract: any;
  gas: string = '200000';
  network: string = 'Desconocida';

  constructor(public walletService: WalletService) {
    // Inicializa Web3 con el proveedor de MetaMask si está disponible
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(() => {
        // Configura el contrato con su ABI y dirección
        this.contract = new this.web3.eth.Contract(factoryABI.default, '0xDb885a7cd58aD7cA96fAb45A0F8574140627002B');
      });
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
    this.walletService.wallet = this.wallet; // También puedes actualizar el servicio si es necesario
  }

  async createEvent(eventName: string, eventOrganizer: string, eventCategory: string, ticketPrice: number) {
    try {
      if (this.web3 && this.contract) {
        const accounts = await this.web3.eth.getAccounts();
        const owner = accounts[0];

        // Convierte el ticketPrice a Wei
        const amountInWei = this.web3.utils.toWei(ticketPrice.toString(), 'ether');

        // Llama a la función createEvent del contrato y envía la transacción a través de MetaMask
        await this.contract.methods.createEvent(eventName, eventOrganizer, eventCategory, amountInWei).send({
          from: owner,
          gas: this.gas // Asegúrate de que el valor de gas sea el adecuado
        });

        console.log('Evento creado con éxito.');
      } else {
        console.error('Web3 o contrato no definidos. Verifica la configuración de MetaMask y la dirección del contrato.');
      }
    } catch (error) {
      console.error('Error al crear el evento:', error);
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