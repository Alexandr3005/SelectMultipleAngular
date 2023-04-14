import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, switchMap, tap } from 'rxjs';
import { PaisesService } from 'src/app/paises/services/paises.service';
import { Pais, PaisSmall } from '../../interface/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {


  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],

  })

  regiones  : string    [] = [];
  paises    : PaisSmall [] = [];
  fronteras : String [] = [];


  cargando: boolean = false;

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones

    // Pais por region   --- Segundo nivel select


    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('pais')?.reset('');   //Cada vez que el select del form cambie, se resertea la info 
          this.cargando = true;

        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))  //Envio la region al value del formulario (Observable)
      )
      .subscribe(paises => {
        this.paises = paises;
        this.cargando = false;
        
      })


      // Pais fronterizo por codigo de pais  --- Tercer nivel select
      
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.cargando = true
        }),
        switchMap(codigo => this.paisesService.getPaisesByCodigo(codigo))
      )
      .subscribe(pais => {
       (pais) ? this.fronteras = pais[0]?.borders : this.fronteras = [];
        this.cargando = false;

      })
   

  }

  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }


  guardar() {
    console.log(this.miFormulario.value)
  }



}
