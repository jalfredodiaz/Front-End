import { MovimientosCuentaModel } from "./movimientos-cuenta-model";

export class CuentaConMovimientosModel {
  SaldoInicial: number = 0;
  Movimientos: MovimientosCuentaModel[] = [];
}
