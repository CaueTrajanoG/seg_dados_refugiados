import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatabaseService } from '../../core/database';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(
      private fb: FormBuilder,
      private dbService: DatabaseService, 
      private router: Router
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  async checar(){
    const emailDigitado = this.loginForm.get('email')?.value;  
    const senha = this.loginForm.get('senha')?.value;

    if(this.validarEmail()){
      try {      
        const usuarioEncontrado = await this.dbService.usuarios
          .where('email').equals(emailDigitado.toLowerCase()).first(); 

        if (!usuarioEncontrado) {
          alert('Este e-mail não está cadastrado.');
          return;
        }      
        // O bcrypt compara a senha digitada com o Hash salvo no banco
        const senhaValida = await bcrypt.compare(senha, usuarioEncontrado.senha!);

        if (senhaValida) {
          alert(`Bem-vindo, ${usuarioEncontrado.nome}!`);
          this.router.navigate(['/cadastro'], { 
            state: { usuarioLogado: usuarioEncontrado } 
          });
        } else {
          alert('Senha incorreta. Tente novamente.');
        }

    } catch (error) {
      console.error('Erro na autenticação:', error);
      alert('Erro ao processar login.');
    }
      }
    }
  

  validarEmail(): boolean{
    var emailValido: boolean;
    const emailDigitado = this.loginForm.get('email')?.value;  
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if(emailPattern.test(emailDigitado)){
      emailValido = true      
    }else{
      emailValido = false
    }
    return emailValido;
  }
  async protegerSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); 
    return await bcrypt.hash(senha, salt);
  }
}
