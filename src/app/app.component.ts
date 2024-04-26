import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dierenVertaler';
  sentence: string;
  newSentence: string;
  form_input: string;
  sentenceObject: any;
  array: string[];
  targetTo: string;

  content_input:string;

  originals: string[] = ['mens', 'labrador', 'poedel', 'parkiet'];
  translators: string[] = [];

  reactiveForm: FormGroup;

  handleTranslation() {

    this.form_input = this.reactiveForm.value.content_input;

    if (typeof this.form_input === 'string' && this.form_input.length !== 0) {

      switch (this.targetTo) {
        case 'labrador':
          this.sentence = this.handleLabrador(this.form_input);
        break;
        case 'poedel':
          this.sentence = this.handlePoedel(this.form_input);
        break;
      }

    } else {
      this.sentence = '';
    }

  }

  handleLabrador(sentence: string) {

    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})

    this.sentenceObject = [...seg.segment(sentence)]
    this.sentenceObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        segmentObject.segment = 'woof'
      }
    })

    this.newSentence = this.sentenceObject.map(x => x.segment).join('');
    return this.newSentence;
  }

  handlePoedel(sentence: string) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})

    this.sentenceObject = [...seg.segment(sentence)]
    this.sentenceObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        segmentObject.segment = 'woofie'
      }
    })

    this.newSentence = this.sentenceObject.map(x => x.segment).join('');
    return this.newSentence;
  }

  onSelectChangeFrom(event: any) {

    const target = event.target.value;

    switch (target) {
      case 'mens':
        this.translators = ['labrador', 'poedel', 'parkiet', 'papegaai'];
      break;
      case 'labrador':
        this.translators = ['poedel', 'papegaai'];
      break;
      case 'poedel':
        this.translators = ['labrador', 'papegaai'];
      break;
      case 'parkiet':
        this.translators = ['papegaai'];
      break;
    }
  }

  onSelectChangeTo(event: any) {
    this.targetTo = event.target.value;
  }

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      content_input: new FormControl(null),
      translate_from: new FormControl(null),
      translate_to: new FormControl(null),
    })
  }
}
