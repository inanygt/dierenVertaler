import { Component } from '@angular/core';
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
export class AppComponent {

  title = 'Dierenvertaler';

  translation_input: string;
  translation_output: string;

  translate_from: string;
  translate_to: string;

  originals: string[] = ['mens', 'labrador', 'poedel', 'parkiet'];
  translators: string[] = [];

  error_translation: string = '';
  is_drunk: boolean = false;

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

  fourthWordBackwards(input: string): string {
    const segObject = this.segmenter(input);
    let wordCount = 0;
    let modifiedInput = '';
    for (const segment of segObject) {
      if (segment.isWordLike) {
        wordCount++;
        if (wordCount % 4 === 0) {
          segment.segment = segment.segment.split('').reverse().join('');
        }
      }
      modifiedInput += segment.segment;
    }

    return modifiedInput;
  }

  handleLabrador(translation_input: string): string {

    const segObject = this.segmenter(translation_input);

    segObject.forEach(segmentObject => {

      if (segmentObject.isWordLike) {
        segmentObject.segment = 'woof'
      }
    })

    this.translation_output = segObject.map(x => x.segment).join('');

    if (this.is_drunk) {
      this.translation_output = this.addProost(this.translation_output);
      this.translation_output = this.fourthWordBackwards(this.translation_output);
      this.translation_output += ' Burp!'
      return this.translation_output;
    }

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

    if (this.is_drunk) {
      this.translation_output = this.addProost(this.translation_output);
      this.translation_output = this.fourthWordBackwards(this.translation_output);
      this.translation_output += ' Burp!'
    }

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

    if (this.is_drunk) {
      this.translation_output = this.addProost(this.translation_output);
      this.translation_output = this.fourthWordBackwards(this.translation_output);
      this.translation_output += ' Burp!'
    }

    return this.translation_output;
  }

  handlePapegaai(translation_input: string): string {

    const sentences: string[] = [];
    const colors = ['red', 'green', 'yellow', 'blue'];

    var result = translation_input.match(/[^\.!\?]*[\.!\?]+/g);

    if (this.hasNoPunctuation(translation_input)) {

      sentences.push('ik praat je na: ' + `<span class="${colors[0]}">` + translation_input.trim() + '</span>' + '</br>');
      return sentences.join('');
    }

    result.forEach((segment, index) =>  {
      const color = colors[index % colors.length];
      sentences.push(' ik praat je na: ' + `<span class="${color}">` + segment.trim() + '</span>' + '</br>');
    })

    return sentences.join('');
  }

  hasNoPunctuation(input: string): boolean {
    return !/[.!?]/.test(input)
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
                this.error_translation = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation = "";
    return true;
}

  validatePoedel(sentence: string): boolean {
    const segObject = this.segmenter(sentence);

    for (const segment of segObject) {
        if (segment.isWordLike) {
            if (segment.segment !== 'woefie') {
                this.error_translation = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation = "";
    return true;
}

  validateParkiet(sentence: string): boolean {
    const segObject = this.segmenter(sentence);

    for (const segment of segObject) {
        if (segment.isWordLike) {
            if (segment.segment !== 'piep' && segment.segment !== 'tjilp') {
                this.error_translation = "Input komt niet overeen met geselecteerde taal";
                this.translation_output = '';
                return false;
            }
        }
    }

    this.error_translation = "";
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

  onInputChange(event: Event): void {
    const translation_input = (event.target as HTMLInputElement).value

    this.detectLanguage(translation_input);
  }

  detectLanguage(input: string) {
    if (input.includes('woefie')) {
      this.translate_from = 'poedel';
      this.updateTranslateToOptions();
    } else if (input.includes('woef')) {
      this.translate_from = 'labrador'
      this.updateTranslateToOptions();
    } else if (input.includes('tjilp') || (input.includes('piep'))) {
      this.translate_from = 'parkiet';
      this.updateTranslateToOptions();
    } else {
      this.translate_from = 'mens';
      this.updateTranslateToOptions();
    }
  }

  updateTranslateToOptions() {

    switch (this.translate_from) {
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

  addProost(input: any) {
    const sentences: string[] = [];
    var result = input.match(/[^\.!\?]*[\.!\?]+/g);

    for (let i = 0; i < result.length; i++) {
      const sentence = result[i];
      if (i % 2 === 0) {
        sentences.push(sentence + ' Proost! ')
      } else {
        sentences.push(sentence.trim());
      }
    }

    return sentences.join('');

  }
}
