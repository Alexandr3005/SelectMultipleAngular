import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../paises/interface/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.com/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[]{
    return [...this._regiones];  // Copia del array sin que su contenido sea afectado
  }

  constructor(private http: HttpClient) { }

  
  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url);
    
  }

  getPaisesByCodigo(codigo: string): Observable<Pais[] | null> {
    if (!codigo) {
      return of(null)
    }
    const url = `https://restcountries.com/v3.1/alpha/${codigo}`

    return this.http.get<Pais[]>(url);

  }




  

  getPaisesPorCodigoSmall(codigo: string): Observable<PaisSmall> {
 
    const url = `https://restcountries.com/v3.1/alpha/${codigo}?fields=alpha3Code,name`

    return this.http.get<PaisSmall>(url);
  }

  getPaisesPorCodigos( borders: string[]): Observable<PaisSmall[]>{


    if (!borders){      // Si el pais no tiene bordes
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);   // llenar peticiones con los observables
    } )


    return combineLatest( peticiones);     //combineLatest Contiene array de las peticiones
  }


 


  
  
}
