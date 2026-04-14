import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatabaseService } from '../../core/database';
import * as bcrypt from 'bcryptjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class CadastroComponent {
  modoEdicao = false;
  idUsuarioLogado?: number;

  cadastroForm: FormGroup;
  constructor(
    private fb: FormBuilder, 
    private dbService: DatabaseService,
    private router: Router
  ) {
        
    this.cadastroForm = this.fb.group
    ({
      nome: ['', Validators.required],
      endereco: [''],
      religiao: [''],
      idade: [''],
      ideologia: [''],
      profissao: [''],
      qtdFilhos: [''],
      rendaPreGuerra: [''],
      formacao: [''],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmaSenha: ['', [Validators.required, Validators.minLength(8)]]
    });


  const navigation = this.router.getCurrentNavigation();
  const usuarioParaEditar = navigation?.extras.state?.['usuarioLogado'];
    if (usuarioParaEditar) {  
      this.modoEdicao = true;  
      this.senhaValida = true;
      this.idUsuarioLogado = usuarioParaEditar.id;

      this.cadastroForm.patchValue({
        nome: usuarioParaEditar.nome,
        email: usuarioParaEditar.email,
        endereco: usuarioParaEditar.endereco,
        idade: usuarioParaEditar.idade,
        profissao: usuarioParaEditar.profissao,
        religiao: usuarioParaEditar.religiao,
        ideologia: usuarioParaEditar.ideologia,
        filhos: usuarioParaEditar.filhos,
        renda: usuarioParaEditar.renda,
        formacao: usuarioParaEditar.formacao
      });
    }
  }

  async registrar() {  
    if (this.cadastroForm.valid && this.senhaValida) {     
      const novosDados = this.cadastroForm.value;      
      const hashSenha = await this.protegerSenha(novosDados.senha);
      try{
            if (this.modoEdicao && this.idUsuarioLogado) {              
              await this.dbService.usuarios.put({
                id: this.idUsuarioLogado,
                nome: novosDados.nome,
                email: novosDados.email,
                senha: hashSenha,
                formacao: novosDados.formacao,
                ideologia: novosDados.ideologia,
                idade: novosDados.idade,
                filhos: novosDados.filhos,
                renda: novosDados.renda,
                endereco: novosDados.endereco,
                religiao: novosDados.religiao,
                profissao: novosDados.profissao
              });
              alert('Dados atualizados com sucesso!');
            }else if(this.emailValido && this.senhaValida){

              //Adicionando novo cadastro ao banco de dados Dexie
              
              const id = await this.dbService.usuarios.add({
                nome: novosDados.nome,
                email: novosDados.email,
                senha: hashSenha,
                formacao: novosDados.formacao,
                ideologia: novosDados.ideologia,
                idade: novosDados.idade,
                filhos: novosDados.filhos,
                renda: novosDados.renda,
                endereco: novosDados.endereco,
                religiao: novosDados.religiao,
                profissao: novosDados.profissao
              }); 
                alert('Dados salvos no banco local com sucesso!');
                this.cadastroForm.reset();
                
                this.router.navigate(['/login']);
            }
        } catch (error) {
          console.error('Erro ao salvar', error);
          alert('Erro ao salvar os dados.');
        }        
            
    }else{
      alert("Email ou senha invalidos, por favor revise")
    } 
  }

  emailValido: Boolean = false;
  async validarEmail(){
    const emailDigitado = this.cadastroForm.get('email')?.value;  
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
  }

  async protegerSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); 
    return await bcrypt.hash(senha, salt);
  }

  senhaValida: Boolean = false;  
  validarSenha(){    
    //black list
    const SENHAS_PROIBIDAS = ['123456', '12345678', 'password', 'senha123','qwerty', 'admin', 'mudar123', 'refugiado2026'];
    const senha1 = this.cadastroForm.get('senha')?.value;
    const senha2 = this.cadastroForm.get('confirmaSenha')?.value;
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
  }

  //botao toggle
  senhaVisivel: boolean = false;
  toggleSenha() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
