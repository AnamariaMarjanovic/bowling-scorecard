import { TestBed } from '@angular/core/testing';

import { ScoringService } from './scoring.service';
import { Frame } from '../models/frame.model';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate score for open frame correctly', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 3 }, { pins: 5 }], score: null, isStrike: false, isSpare: false, isLastFrame: false },
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(8);
  });

  it('should calculate score for a spare correctly', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 7 }, { pins: 3 }], score: null, isStrike: false, isSpare: false, isLastFrame: false },
      { attempts: [{ pins: 4 }], score: null, isStrike: false, isSpare: false, isLastFrame: false }
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(14);
  });

  it('should calculate score for a strike correctly', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 10 }], score: null, isStrike: false, isSpare: false, isLastFrame: false },
      { attempts: [{ pins: 3 }, { pins: 6 }], score: null, isStrike: false, isSpare: false, isLastFrame: false }
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(19);
  });

  it('should handle two strikes in a row', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 10 }], score: null, isStrike: false, isSpare: false, isLastFrame: false },
      { attempts: [{ pins: 10 }], score: null, isStrike: false, isSpare: false, isLastFrame: false },
      { attempts: [{ pins: 4 }, { pins: 2 }], score: null, isStrike: false, isSpare: false, isLastFrame: false }
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(24);
    expect(result[1].score).toBe(40);
    expect(result[2].score).toBe(46);
  });

  it('should handle incomplete frame with no score yet', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 4 }], score: null, isStrike: false, isSpare: false, isLastFrame: false }
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(4);
  });

  
  it('should handle a spare with no next frame', () => {
    const frames: Frame[] = [
      { attempts: [{ pins: 5 }, { pins: 5 }, { pins: 4 }], score: null, isStrike: false, isSpare: false, isLastFrame: true }
    ];

    const result = service.calculateScore(frames);

    expect(result[0].score).toBe(14);
  });
});
