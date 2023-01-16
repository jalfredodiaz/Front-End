import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SiNo'
})
export class SiNoPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'SI' : 'NO';
  }

}
