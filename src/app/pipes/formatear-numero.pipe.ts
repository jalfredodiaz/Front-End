import { Pipe, PipeTransform } from '@angular/core';


// Servicios
import { UtileriasService } from '../services/utilerias/utilerias.service';


@Pipe({
  name: 'FormatearNumero'
})
export class FormatearNumeroPipe implements PipeTransform {

  constructor(private utileriasService: UtileriasService) { }

  transform(value: number | string, decimales: number = 2): string {
    return this.utileriasService.formatearNumero(value, decimales);
  }

  parse(value: string, decimales: number = 2): string {
    return this.utileriasService.limpiarFormatoNumero(value, decimales);
  }
}
