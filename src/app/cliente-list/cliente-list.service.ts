import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteListService {
  private headers = { 'X-PO-No-Count-Pending-Requests': 'false', 'X-PO-Screen-Lock': 'true' }

  constructor( private http : HttpClient  ) { }

  get(PAGE) {
    // com tela para travar
    return this.http.get('http://localhost:8086/rest/cliente/v1',  { headers: this.headers, params: {PAGE} });
    // sem tela para travar
    //return this.http.get('cliente/v1');
  }

  delete(A1_COD: string, A1_LOJA: string) {
    return this.http
      .delete(`http://localhost:8086/rest/cliente/v1/${A1_COD}/${A1_LOJA}`,
        { headers: this.headers });
  }


  put(A1_COD: string, A1_LOJA: string) {
    return this.http.put(`http://localhost:8086/rest/cliente/v1/${A1_COD}/${A1_LOJA}`,
      { headers: this.headers });
  }


}
