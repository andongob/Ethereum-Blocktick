import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ABI as NFTblockTickABI } from 'src/ABI/NFTblockTickABI';

@Injectable({
  providedIn: 'root'
})
export class NFTblockTickService {
  private web3: any;
  private nftContract: any;
  private nftContractAddress: string = '0x1241b3410Cd85093C515c090A85b3163239CfD76';

  constructor() {
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider('https://sepolia.infura.io/v3/87388b2cafcd4bcdbb26947767a1869f'));
    this.nftContract = new this.web3.eth.Contract(NFTblockTickABI.default, this.nftContractAddress);
  }

  async getNFTDetails(nftId: number): Promise<any> {
    try {
      // Supongamos que el contrato inteligente tiene una función para obtener los detalles de un NFT por su ID.
      const result = await this.nftContract.methods.getNFTDetails(nftId).call();

      // Procesa los datos obtenidos desde el contrato para construir un objeto con los detalles del NFT.
      const nftDetails = {
        name: result.name,
        imageUrl: result.imageUrl,
        description: result.description,
        price: result.price,
        // Agrega más propiedades según sea necesario
      };

      return nftDetails;
    } catch (error) {
      console.error('Error al cargar los detalles del NFT:', error);
      return null;
    }
  }
}

