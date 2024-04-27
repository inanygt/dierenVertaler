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

  error_translation_input: string = '';

  className: string = '';

  onSubmit(form: NgForm): void {

    const input = form.value.translation_input;

      if (typeof input === 'string' && input.length !== 0) {

        switch (this.translate_to) {
          case 'labrador':
            this.translation_output = this.handleLabrador(input);
            this.className = 'labrador';
          break;
          case 'poedel':
            this.translation_output = this.handlePoedel(input);


            if (this.translate_from == 'labrador') {
              this.validateLabrador(input);
            }

            this.className = 'poedel';
          break;
          case 'parkiet':
            this.translation_output = this.handleParkiet(input);
            this.className = 'parkiet';
          break;
          case 'papegaai':
            this.translation_output = this.handlePapegaai(input);

            if (this.translate_from == 'labrador') {
              this.validateLabrador(input);
            } else if (this.translate_from == 'parkiet') {
              this.validateParkiet(input);
            }

            this.className = 'papegaai';
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
    const colors = ['red', 'green', 'yellow', 'blue'];

    result.forEach((segment, index) =>  {

      const color = colors[index % colors.length];
      sentences.push(' ik praat je na: ' + `<span class="${color}">` + segment.trim() + '</span>' + '</br>');
    })

    return sentences.join('');
  }

  onSelectChangeFrom(translate_from: string): void {

    this.translate_from = translate_from;

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

  // validation //

  validateLabrador(sentence: string): boolean {
    const segObject = this.segmenter(sentence);

    for (const segment of segObject) {
        if (segment.isWordLike) {
            if (segment.segment !== 'woef') {
                this.error_translation_input = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation_input = "";
    return true;
}

  validatePoedel(sentence: string): boolean {
    const segObject = this.segmenter(sentence);

    for (const segment of segObject) {
        if (segment.isWordLike) {
            if (segment.segment !== 'woefie') {
                this.error_translation_input = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation_input = "";
    return true;
}

  validateParkiet(sentence: string): boolean {
    const segObject = this.segmenter(sentence);

    for (const segment of segObject) {
        if (segment.isWordLike) {
            if (segment.segment !== 'piep' && segment.segment !== 'tjilp') {
                this.error_translation_input = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation_input = "";
    return true;
}

  // helpers //

  segmenter(input: string) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word'})
    return [...seg.segment(input)]
  }

  startsWithVowel(word: string): boolean {
    return /^[aeiou]/i.test(word);
  }

  ngOnInit() {

  }
}
