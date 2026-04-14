import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';


export interface Usuario {
  id?: number; 
  nome?: string;
  email?: string;
  senha?: string; 

  renda?: string;
  filhos?: string;
  formacao?: string;
  ideologia?: string;
  endereco?: string;
  religiao?: string;
  idade?: string;
  profissao?: string;
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService extends Dexie {
  usuarios!: Table<Usuario>;

  constructor() {
    super('RefugiadosDB');
    this.version(1).stores({
      usuarios: '++id, email'
    });
  }
}