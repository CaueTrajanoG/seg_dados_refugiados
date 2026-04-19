import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CadastroComponent } from './cadastro';
import { OculterPass } from '../../services/OcultarPass';

describe('CadastroComponent', () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
    providers: [provideRouter([]), OculterPass]
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
