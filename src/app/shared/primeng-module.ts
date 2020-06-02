import { NgModule } from '@angular/core';
import { DropdownModule, SliderModule } from 'primeng';


@NgModule({
    imports: [
        DropdownModule,
        SliderModule
    ],
    exports: [
        DropdownModule,
        SliderModule
    ]
})
export class PrimeNGModule { }
