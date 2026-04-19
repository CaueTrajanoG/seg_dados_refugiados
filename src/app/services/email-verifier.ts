import { inject, Injectable } from '@angular/core';
import { DatabaseService } from './../core/database'
@Injectable({
  providedIn: 'root',
})
export class EmailVerifier {
  dbService = inject(DatabaseService)
  emailValido = false;
  async verifier(email :string , ): Promise<boolean>{
    const emailDigitado =  email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if(emailPattern.test(emailDigitado)){
      //verificar se email esta disponivel
      const usuarioEncontrado = await this.dbService.usuarios.where('email').equals(emailDigitado.toLowerCase()).first(); 

      if(!usuarioEncontrado){
        this.emailValido = true
      }else{
        alert("Email já está em uso.")
        this.emailValido = false
      }
    }else{
      alert("Insira um email valido")
    }
    return this.emailValido;
  }
}
