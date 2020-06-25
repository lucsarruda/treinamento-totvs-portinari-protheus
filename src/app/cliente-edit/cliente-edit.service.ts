import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteEditService {

  private headers = { 'X-PO-No-Count-Pending-Requests': 'false', 'X-PO-Screen-Lock': 'true' }

  constructor(private http : HttpClient) { }

  public getId(A1_COD: string, A1_LOJA: string){
    return this.http.get(`http://localhost:8086/rest/cliente/v1/${A1_COD}/${A1_LOJA}`,  {  headers: this.headers });
  }

  public post(DATA) {
    return this.http.post<any>(`http://localhost:8086/rest/cliente/v1`, DATA, { headers: this.headers });
  }

  public put(DATA, A1_COD: string, A1_LOJA: string) {
    return this.http.put<any>(`http://localhost:8086/rest/cliente/v1/${A1_COD}/${A1_LOJA}`, DATA, { headers: this.headers });
  }


}
