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
        case 'parkiet':
          this.sentence = this.handleParkiet(this.form_input);
        break;
        case 'papegaai':
          this.sentence = this.handlePapegaai(this.form_input);
      }

    } else {
      this.sentence = '';
    }

  }



  handleLabrador(sentence: string) {

    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})
    const test = [...seg.segment(sentence)];


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

  handleParkiet(sentence: string) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})

    this.sentenceObject = [...seg.segment(sentence)]
    this.sentenceObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {

        if (this.startsWithVowel(segmentObject.segment)) {
          segmentObject.segment = 'tjilp'
        } else {
          segmentObject.segment = 'piep'
        }
      }
    })

    this.newSentence = this.sentenceObject.map(x => x.segment).join('');
    return this.newSentence;
  }

  handlePapegaai(sentence: any) {


    const sentences = sentence.split(/[\.\?\!]+/);

    const test = [];


    sentences.forEach(sentence =>  {
      if (sentence !== '') {
        test.push('ik praat je na: ' + sentence);
      }

    })



    return sentences;

  }

  startsWithVowel(word: string) {
    return /^[aeiou]/i.test(word); // i flag makes the regex case-insensitive
  }

  onSelectChangeFrom(translate_from: string) {

    switch (translate_from) {
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
