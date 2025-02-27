import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/Interfaces';
import { LivroVolumeInfo } from 'src/app/models/LivroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro: string = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  // Ajuste no tipo do Observable
  livrosEncontrados$: Observable<LivroVolumeInfo[]> =
    this.campoBusca.valueChanges.pipe(
      debounceTime(PAUSA),
      tap(() => console.log('fluxo inicial')),
      filter((valorDigitado) => valorDigitado.length >= 3),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map((resultado) => {this.livrosResultado = resultado; 
        return resultado.items ? this.livroResultadoParaLivros(resultado.items) : [];
      }),
      catchError((erro) => {
        console.log(erro);
        this.mensagemErro = 'Opa, ocorreu um erro, recarregue a página!';
        return of([]); // Retorna um array vazio em caso de erro
      })
    );

  // livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
  //   debounceTime(PAUSA),
  //   tap(() => console.log('fluxo inicial')),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   tap((retornoAPI) => console.log(retornoAPI)),
  //   map((resultado) => (this.livrosResultado = resultado)),
  //   map((resultado) => resultado.items ?? []),
  //   tap(console.log),
  //   map((items) => this.livroResultadoParaLivros(items)),
  //   catchError((erro) => {
  //     console.log(erro);
  //     return throwError(
  //       () =>
  //         new Error(
  //           (this.mensagemErro = 'Opa, ocorreu um erro, recarregue a página!')
  //         )
  //     );
  //   })
  // );

  livroResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
