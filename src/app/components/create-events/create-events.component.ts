import { Component } from '@angular/core';
import Web3 from 'web3';
import { WalletService } from 'src/app/wallet.service';
import { ABI as blockTickEventABI } from 'src/ABI/blockTickEventABI';

declare let window: any;

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.scss']
})

export class CreateEventsComponent {
  wallet: any = {
    address: ''
  };
  contractAddress: string = '0x86C27e65542dB6ab00a82297A97bD3fD6412d2D6';
  ownerAddress: string | undefined = '';

  web3: Web3 | undefined;
  contract: any;
  eventName?: string;
  eventOrganizer?: string;
  eventCategory?: string;
  ticketPrice?: number;
  gas: string = '3000000';
  transactionHash: string = '';
  transactionMessage: string = '';


  constructor(public walletService: WalletService) {

      // Inicializa una instancia de Web3 con el proveedor de Infura si está disponible.
  this.web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));

    // Inicializa la propiedad wallet con una dirección y clave privada en blanco.
    this.wallet = {
      address: '',
      privateKey: ''
    };

    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(() => {
        this.contract = new this.web3!.eth.Contract(blockTickEventABI.default, this.contractAddress);
      });

      this.getOwnerAddress(); // Llamada a la función para obtener la dirección del propietario
    } else {
      console.error('MetaMask no está instalado o configurado en el navegador.');
    }
  }

  async ngOnInit() {
    try {
      if (!this.walletService.wallet || !this.walletService.wallet.walletAddress) {
        await this.walletService.initWallet('member cushion summer grid staff card owner hazard multiply trial panel now');
      }
      this.wallet = this.walletService.wallet;
    } catch (error) {
      console.error('Error al inicializar la billetera:', error);
    }
  }

  async createEvent() {
    try {
      if (!this.ownerAddress) {
        console.error('La dirección del propietario no está definida.');
        return;
      }
  
      const accounts = await this.web3!.eth.getAccounts();
      this.ownerAddress = accounts[0];
  
      // Mostrar detalles de la ABI
      console.log('ABI completo:', this.contract.options.jsonInterface);
  
      // Para mostrar información específica sobre una función del contrato:
      const createEventFunction = this.contract.methods.createEvent;
      console.log('Detalles de la función createEvent:', createEventFunction._method);
  
      // También puedes imprimir detalles específicos de los eventos si los tienes en tu ABI:
  
      console.log('Valores de los parámetros:');
      console.log('   Nombre del evento:', this.eventName);
      console.log('   Organizador:', this.eventOrganizer);
      console.log('   Categoría del evento:', this.eventCategory);
      console.log('   Precio de los boletos:', this.ticketPrice);

          // Agrega estos console.log para verificar los valores de los parámetros
    console.log('   Tipo de eventName:', typeof this.eventName);
    console.log('   Tipo de eventOrganizer:', typeof this.eventOrganizer);
    console.log('   Tipo de eventCategory:', typeof this.eventCategory);
    console.log('   Tipo de ticketPrice:', typeof this.ticketPrice);
  
      const contractMethod = createEventFunction(
        this.eventName,
        this.eventOrganizer,
        this.eventCategory,
        this.ticketPrice
      );
  
      // Verificar el método que se está aplicando
      console.log('Método que se está aplicando:', contractMethod.encodeABI());
  
      // Verificar la dirección del contrato
      console.log('Dirección del contrato:', this.contract.options.address);
  
      // Verificar la dirección del propietario
      console.log('Dirección del propietario:', this.ownerAddress);
  
      // Verificar el gas
      console.log('Valor de gas:', this.gas);
  
      // Obtén la firma de la función createEvent del ABI
      const abiCreateEvent = this.contract.options.jsonInterface.find(
        (item: any) =>
          item.name === 'createEvent' &&
          item.type === 'function' &&
          item.inputs.length === 4
      );
      console.log('Firma de createEvent en el ABI:', abiCreateEvent.signature);
  
      // Verificar la firma de la función createEvent
      if (contractMethod.encodeABI() === abiCreateEvent.signature) {
        console.log('Las firmas coinciden, la función está definida correctamente.');
      } else {
        console.error('Las firmas no coinciden, verifica la definición de la función.');
        return;
      }
  
      // Antes de realizar la transacción
      console.log('Realizando la transacción...');
  

      // Llama a la función createEvent del contrato factory con los parámetros
      const transaction = await this.contract.methods.createEvent(
        this.eventName,
        this.eventOrganizer,
        this.eventCategory,
        this.ticketPrice
      ).send({
        from: this.ownerAddress,
        gas: this.gas
      });
  
      // Después de completar la transacción
      console.log('Transacción completada.');
  
      console.log('Detalles de la transacción:', transaction);
      console.log('Transacción exitosa:', transaction);
    } catch (error) {
      console.error('Error al crear el evento:', error);
    }
  }
  
  
  

  async getOwnerAddress() {
    const accounts = await this.web3!.eth.getAccounts();
    this.ownerAddress = accounts[0];
  }
}

