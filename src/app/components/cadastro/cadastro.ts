import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatabaseService } from '../../core/database';
import { Router } from '@angular/router';
import { OculterPass } from '../../services/OcultarPass'
import { EmailVerifier } from '../../services/email-verifier'
import { PasswordVerifier } from '../../services/password-verifier'

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
  private oculter = inject(OculterPass);
  private emailVerifier = inject(EmailVerifier);
  private passwordVerifier = inject(PasswordVerifier);

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
      const hashSenha = await this.oculter.passwordOculter(novosDados.senha);
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
    this.emailValido = await this.emailVerifier.verifier(this.cadastroForm.get('email')?.value)    
  }

  senhaValida: Boolean = false;  
  validarSenha(){
    this.senhaValida = this.passwordVerifier.verifier(
      this.cadastroForm.get('senha')?.value,
      this.cadastroForm.get('confirmaSenha')?.value
    )
  }

  //botao toggle
  senhaVisivel: boolean = false;
  toggleSenha() {
    this.senhaVisivel = !this.senhaVisivel;
  }
}
