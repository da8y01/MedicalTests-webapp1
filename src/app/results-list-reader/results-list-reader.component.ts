import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '../backend.service';
import { QueryParams } from '../query-params.model';
import { Result } from '../result.model';

@Component({
  selector: 'app-results-list-reader',
  templateUrl: './results-list-reader.component.html',
  styleUrls: ['./results-list-reader.component.css'],
})
export class ResultsListReaderComponent implements OnInit {
  @Input('patient') inputPatient: number = 0;
  results: Result[] = [];
  currentUrl = '';
  paginatorData = {
    length: 0,
    pageSize: 10,
  };
  queryParams = {
    offset: 0,
    limit: 10,
    patient: 0,
  };
  formData: FormData = null;
  showValidation = false;

  constructor(public backendService: BackendService, private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.queryParams.patient = this.inputPatient;
    this.getResults(this.queryParams);
  }

  downloadFile(url: string, event: MouseEvent) {
    event.preventDefault();
    fetch(url).then(function (t) {
      return t.blob().then((blob) => {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        var fileName = url.substring(url.indexOf('.com/') + 5);
        a.setAttribute('download', fileName);
        a.click();
      });
    });
  }

  deleteReading(resultId: number, event: Event) {
    event.preventDefault();
    const result = confirm(
      '[ALERTA] Está seguro que desea eliminar la Lectura?'
    );
    if (result) {
      this.backendService.deleteReading(resultId).subscribe(
        (res) => {
          if (res.count === 1) {
            window.location.reload();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  checkSelectedResult(fileReading: any) {
    if (!this.selectedResult) {
      alert(
        '[ALERTA] Debe seleccionar un resultado antes de cargar su Lectura.'
      );
    } else {
      fileReading.click();
    }
  }

  async updateReading() {
    try {
      const reading = await this.backendService.uploadReading(
        this.formData,
        this.selectedResult.id
      );
      this.showValidation = false;
      window.location.reload();
    } catch (error) {
      this.showValidation = true;
    }
  }

  pageEvent(event: any): void {
    this.queryParams.limit = this.paginatorData.pageSize;
    this.queryParams.offset = this.paginatorData.pageSize * event.pageIndex;
    this.getResults(this.queryParams);
  }

  getResults(queryParams: QueryParams): void {
    this.backendService.getResults(queryParams).subscribe((results) => {
      this.paginatorData.length = results.count;
      this.results = results.rows;
    });
  }

  selectedResult: Result;
  checkClick(result: Result, index: number) {
    this.selectedResult = result;
  }

  onFileReading(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.formData = new FormData();
      this.formData.append(
        'reading',
        file,
        file.name.trim().replace(/\s+/gm, '_')
      );
    }
  }
}
