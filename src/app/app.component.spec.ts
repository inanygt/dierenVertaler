import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Dierenvertaler' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Dierenvertaler');
  });

  it('should initialize translation_input as undefined', () => {
  const fixture = TestBed.createComponent(AppComponent);
  const app = fixture.componentInstance;
  expect(app.translation_input).toBeUndefined();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dierenvertaler');
  });

  it('should return true for a word starting with a vowel', () => {
    const app = new AppComponent;
    const word = 'apple';
    expect(app.startsWithVowel(word)).toBe(true);
  })

  it('should return false for a word starting with a consonant', () => {
    const app = new AppComponent;
    const word = 'baby';
    expect(app.startsWithVowel(word)).toBe(false);
  })
});
