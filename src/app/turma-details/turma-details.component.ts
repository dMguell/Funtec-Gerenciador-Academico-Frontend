import { Component, OnInit } from '@angular/core';
import { Turma } from '../turma';
import { ActivatedRoute } from '@angular/router';
import { TurmaService } from '../turma.service';
import { ChamadaService } from '../chamada.service';
import { Chamada } from '../chamada';
import { CursoService } from '../curso.service';
import { Curso } from '../curso';

@Component({
  selector: 'app-turma-details',
  templateUrl: './turma-details.component.html',
  styleUrls: ['./turma-details.component.css']
})
export class TurmaDetailsComponent implements OnInit {

  id: number = 0;
  turma: Turma = new Turma();
  chamada: Chamada = new Chamada();
  cursos: Curso[] = [];

  chamadasCadastrados: Chamada[] = [];

  listaChamadas: Chamada[] = [];

  constructor(private route: ActivatedRoute,
    private turmaService: TurmaService,
    private chamadaService: ChamadaService,
    private cursoSerice: CursoService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.turmaService.getTurmaById(this.id).subscribe(data => {
      this.turma = data;
      this.chamadasCadastrados = [];

      this.chamadaService.getChamadaListCadastradosByTurma(this.turma.id).subscribe(data => {


        this.chamadasCadastrados = data;
        this.cursos[0] = this.chamadasCadastrados[0].turma.curso;
        console.log("printando data")
        console.log(data);




        for (let i = 0; i < this.chamadasCadastrados.length; i++) {
          this.chamadasCadastrados[i].aluno.cpf = this.chamadasCadastrados[i].aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

          this.chamadaService.getChamadaByAluno(this.chamadasCadastrados[i].aluno.id).subscribe(data => {

            for (let j = 0; j < data.length; j++) {
              this.listaChamadas.push(data[j]);

            };

            for (let i = 0; i < this.chamadasCadastrados.length; i++) {

              let contador: number = 0;
              console.log(this.listaChamadas.length)
              for (let j = 0; j < this.listaChamadas.length; j++) {

                console.log("começando for do aluno: ")

                if (this.chamadasCadastrados[i].aluno.id == this.listaChamadas[j].aluno.id && this.chamadasCadastrados[i].turma.id == this.listaChamadas[j].turma.id) {
                  contador = contador + this.listaChamadas[j].presenca;


                }
                this.chamadasCadastrados[i].presenca = contador;
                console.log(this.chamadasCadastrados[i])
              }


            }


          });


        };

        console.log("printando lista chamadas");
        console.log(this.listaChamadas);

        console.log("teste")
        console.log(this.chamadasCadastrados.length)



      })
    });

    this.getCadastrados();
  }

  private getCadastrados() {
    this.chamadasCadastrados = [];
    this.chamadaService.getChamadaListCadastradosByTurma(this.turma.id).subscribe(data => {
      this.chamadasCadastrados = data;
      console.log(data);

    })
  }

}
