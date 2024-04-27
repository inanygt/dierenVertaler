import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'dierenVertaler';

  translation_input: string;
  translation_output: string;

  translate_from: string;
  translate_to: string;

  originals: string[] = ['mens', 'labrador', 'poedel', 'parkiet'];
  translators: string[] = [];


  onSubmit(form: NgForm): void {

    const input = form.value.translation_input;

      if (typeof input === 'string' && input.length !== 0) {

        switch (this.translate_to) {
          case 'labrador':
            this.translation_output = this.handleLabrador(input);
          break;
          case 'poedel':
            this.translation_output = this.handlePoedel(input);
          break;
          case 'parkiet':
            this.translation_output = this.handleParkiet(input);
          break;
          case 'papegaai':
            this.translation_output = this.handlePapegaai(input);
        }

      } else {
        this.translation_output = '';
      }
  }

  handleLabrador(translation_input: string): string {

    const segObject = this.segmenter(translation_input);
    segObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        segmentObject.segment = 'woof'
      }
    })

    this.translation_output = segObject.map(x => x.segment).join('');
    return this.translation_output;
  }

  handlePoedel(translation_input: string): string {

    const segObject = this.segmenter(translation_input);
    segObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        segmentObject.segment = 'woofie'
      }
    })

    this.translation_output = segObject.map(x => x.segment).join('');
    return this.translation_output;
  }

  handleParkiet(translation_input: string): string {

    const segObject = this.segmenter(translation_input);
    segObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        if (this.startsWithVowel(segmentObject.segment)) {

          segmentObject.segment = '<span class="tjilp">tjilp</span>'
          console.log(segmentObject.segment);
        } else {
          segmentObject.segment = 'piep'
        }
      }
    })

    this.translation_output = segObject.map(x => x.segment).join('');
    return this.translation_output;
  }

  handlePapegaai(translation_input: any): string {

    var result = translation_input.match( /[^\.!\?]+[\.!\?]+/g );
    const sentences = [];

    result.forEach((segment, index) =>  {
      if (index >= 1 ) {
        sentences.push(' ik praat je na: ' + segment.trim());
      } else {
        sentences.push('ik praat je na: ' + segment.trim());
      }
    })

    return sentences.join('');
  }

  onSelectChangeFrom(translate_from: string): void {

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

  onSelectChangeTo(event: Event): void {
    this.translate_to = (event.target as HTMLInputElement).value;
  }

  // helpers //

  segmenter(input: any) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})
    return [...seg.segment(input)]
  }

  startsWithVowel(word: string): boolean {
    return /^[aeiou]/i.test(word);
  }

  getOutputTextareaClass(): string {
    switch (this.translate_to) {
        case 'labrador':
            return 'labrador-output';
        case 'poedel':
            return 'poedel-output';
        case 'parkiet':
            return 'parkiet-output';
        case 'papegaai':
            return 'papegaai-output';
        default:
            return ''; // Return default class if no specific style is needed
    }
}

  ngOnInit() {

  }
}
