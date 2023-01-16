import { Directive, HostListener, ElementRef, OnInit, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { UtileriasService } from 'src/app/services/utilerias/utilerias.service';

@Directive({
  selector: '[AppFormatNumber]'
})
export class FormatNumberDirective implements OnInit, ControlValueAccessor {
  private el: HTMLInputElement;
  private numeros = '1,2,3,4,5,6,7,8,9,0';
  private tieneFoco = false;
  // Codigos ASCII
  private permitidos = [8, 9, 37, 38, 39, 40, 46];

  @Input() decimales = 2;
  @Input() set valor(valor) {
    // console.log('VALOR', valor);
    this.el.value = this.utileriasService.limpiarFormatoNumero(valor.toString(), this.decimales);
  }

  @Input('value')
  set value(value: string | null) {
    // this.el
    console.log('value');
    // this.formatValue(value);
  }

  constructor(
    private elementRef: ElementRef,
    private utileriasService: UtileriasService
  ) {
    this.el = this.elementRef.nativeElement;
  }
  writeValue(obj: any): void {
    console.log('write value', obj);
    this.el.value = obj;
  }
  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.el.value = this.utileriasService.formatearNumero(this.el.value, this.decimales);
    // console.log(this.elementRef);
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    this.el.value = this.utileriasService.limpiarFormatoNumero(value, this.decimales); // opossite of transform
    this.tieneFoco = true;
  }

  @HostListener('storage', ['$event.target.value'])
  onStorage(value) {
    console.log('storage');
    this.el.value = this.utileriasService.limpiarFormatoNumero(value, this.decimales); // opossite of transform
    this.tieneFoco = true;
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = this.utileriasService.formatearNumero(value, this.decimales);
    this.tieneFoco = false;
  }
  @HostListener('keydown', ['$event'])
  onKey(value) {
    if (this.numeros.indexOf(value.key) > -1) {
      // Permitido
    } else if (this.permitidos.indexOf(value.keyCode) > -1) {
      // Permitido
    } else if (this.decimales > 0 && value.key === '.' && this.el.value.indexOf('.') === -1) {
      // Permitido
    } else {
      // No permitido
      event.preventDefault();
    }
  }
  @HostListener('change', ['$event.target.value'])
  onChange(value) {
    // console.log('Change', value);
    if (!this.tieneFoco) {
      this.el.value = this.utileriasService.formatearNumero(value, this.decimales);
    }
  }
  @HostListener('input', ['$event.target.value'])
  onInput(value) {
    if (!this.tieneFoco) {
      this.el.value = this.utileriasService.formatearNumero(value, this.decimales);
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(value) {
    if (!this.tieneFoco) {
      this.el.value = this.utileriasService.formatearNumero(value, this.decimales);
    }
  }

  @HostListener('reset', ['$event'])
  onReset(value) {
    if (!this.tieneFoco) {
      this.el.value = this.utileriasService.formatearNumero(value, this.decimales);
    }
  }
}
