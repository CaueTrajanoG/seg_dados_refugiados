import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordVerifier {
  senhaValida = false;
  verifier(pass1 : string, pass2:string): boolean{    
    //black list
    const SENHAS_PROIBIDAS = ['123456', '12345678', 'password', 'senha123','qwerty', 'admin', 'mudar123', 'refugiado2026'];
    const senha1 = pass1;
    const senha2 = pass2;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/

    if(!SENHAS_PROIBIDAS.includes(senha1?.toLowerCase())){ 
      if(passwordPattern.test(senha1)){      
        if(senha1 == senha2){        
          this.senhaValida = true;
        }
      }else{
        this.senhaValida = false;
        alert("Senha invalida, revise!")
      }
    }else{
      alert("Senha fraca, para sua segurança inclua maiusculas e caracteres especiais.")
    }
    return this.senhaValida;
  }

}
