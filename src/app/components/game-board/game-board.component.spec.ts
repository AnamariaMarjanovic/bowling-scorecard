import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { GameBoardComponent } from './game-board.component';
import { Frame } from '../../core/models/frame.model';
import { addAttempt, resetGame } from '../../store/actions/game.actions';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let store: MockStore;

  const mockInitialFrame: Frame = {
    attempts: [],
    score: null,
    isStrike: false,
    isSpare: false,
    isLastFrame: false
  }

  const initialState = {
    gameState: {
      game:
      {
        frames: Array(10).fill({ ...mockInitialFrame }),
        currentFrame: 0,
        isCompleted: false
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoardComponent],
      providers: [provideMockStore({ initialState })]
    })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the componen', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch addAttempt when a pin - NUMBER is clicked', () => {
    const spyDispatch = spyOn(store, 'dispatch');
    component.submitAttempt(5);
    expect(spyDispatch).toHaveBeenCalledWith(addAttempt({ pins: 5 }));
  })

  it('should dispatch addAttempt when a pin - STRIKE is clicked', () => {
    const spyDispatch = spyOn(store, 'dispatch');
    store.overrideSelector('selectGame',
      {
        frames: [
          { attempts: [], isLastFrame: false },
          ...Array(9).fill({ attempts: [], isLastFrame: false })
        ],
        currentFrame: 0,
        isCompleted: false
      }
    )

    component.submitAttempt('X');
    expect(spyDispatch).toHaveBeenCalledWith(addAttempt({ pins: 10 }))
  })

  it('should dispatch addAttempt when a pin - SPARE is clicked after first roll of 4', () => {
    const spyDispatch = spyOn(store, 'dispatch');
    store.overrideSelector('selectGame',
      {
        frames: [
          { attempts: [{ pins: 4 }], isLastFrame: false },
          ...Array(9).fill({ attempts: [], isLastFrame: false })
        ],
        currentFrame: 0,
        isCompleted: false
      }
    )

    component.submitAttempt('X');
    expect(spyDispatch).toHaveBeenCalledWith(addAttempt({ pins: 10 }))
  })

  it('should dispatch resetGame on resetGame()', () => {
    const spyDispatch = spyOn(store,'dispatch');
    component.resetGame();
     expect(spyDispatch).toHaveBeenCalledWith(resetGame());
  })
});
