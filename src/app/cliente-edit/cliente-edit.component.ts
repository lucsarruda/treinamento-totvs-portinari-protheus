import { ClienteEditService } from './cliente-edit.service';
import { PoNotificationService, PoPageAction, PoBreadcrumb, PoTableColumn, PoTableAction, PoSelectOption } from '@po-ui/ng-components';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-edit',
  templateUrl: './cliente-edit.component.html',
  styleUrls: ['./cliente-edit.component.css']
})
export class ClienteEditComponent implements OnInit {

  public alteraItem = false;
  public items = [];

  public A1_COD : string ;
  public A1_LOJA: string ;
  public reactiveForm : FormGroup;
  public addItemForm: FormGroup;
  public readonly actions: Array<PoPageAction> = [
    { label: 'Salvar', action: () => { this.saveForm() } },
    { label: 'Cancelar', action: () => { this.router.navigate(['/client-list']) } },

  ];
  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Home', link: '/' },
    { label: 'Clientes', link: '/client-list' },
    { label: 'Edição ' }
    ]
  };

  constructor(  private fb : FormBuilder ,
                private routerActive  : ActivatedRoute,
                private router : Router,
                private clienteEditService : ClienteEditService,
                private poNotification : PoNotificationService,
    ) { }

  ngOnInit(): void {
    this. createReactiveForm()

    this.routerActive.params.subscribe( async params => {
      if (params.A1_COD) {
        const retorno =  await this.clienteEditService.getId(params.A1_COD, params.A1_LOJA).toPromise();
        this.reactiveForm.patchValue( retorno );
        this.A1_COD = this.reactiveForm.get('A1_COD').value
        this.A1_LOJA = this.reactiveForm.get('A1_LOJA').value
      }
    });

  }


  createReactiveForm() {

    this.reactiveForm = this.fb.group({
      A1_COD: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(6)])],
      A1_LOJA: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)])],
      A1_NOME: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
      A1_NREDUZ: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(40)])],
      A1_CGC: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(14)])],
      A1_MSBLQL: ['', Validators.required]
    });

  }


  async saveForm() {

    if (this.A1_COD){
      await this.clienteEditService.put(JSON.stringify(this.reactiveForm.value),this.A1_COD, this.A1_LOJA ).toPromise()
    } else {
      await this.clienteEditService.post(JSON.stringify(this.reactiveForm.value)).toPromise()
    }
    //this.poNotification.success({ message: `Cliente incluído com sucesso` });
    this.router.navigate(['/client-list']);
  }



}
