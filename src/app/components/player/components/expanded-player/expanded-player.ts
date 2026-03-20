import { Component, computed, inject, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBackward,
  heroForward,
  heroPause,
  heroPlay,
  heroSpeakerWave,
  heroSpeakerXMark,
  heroChevronDown,
} from '@ng-icons/heroicons/outline';
import { WebPlayer as PlayerService } from '../../../../services/web-player/web-player';
import { FormatDurationPipe } from '../../../../pipes/format-duration-pipe';

@Component({
  selector: 'app-expanded-player',
  standalone: true,
  imports: [CommonModule, FormatDurationPipe, NgIcon],
  providers: [
    provideIcons({
      heroBackward,
      heroForward,
      heroPause,
      heroPlay,
      heroSpeakerWave,
      heroSpeakerXMark,
      heroChevronDown,
    }),
  ],
  templateUrl: './expanded-player.html',
  styleUrl: './expanded-player.css',
})
export class ExpandedPlayer {
  /** Web player service inject */
  protected readonly webPlayer = inject(PlayerService);

  /** Inputs from parent */
  currentColors = input.required<string[]>();
  isLightBackground = input.required<boolean>();
  isClosing = input.required<boolean>();

  /** Output to notify parent to toggle open mode */
  toggleClose = output<void>();

  /** Signal to track if the user is dragging the seek bar */
  private readonly isDragging = signal(false);
  /** Signal to store the temporary seek value during drag */
  private readonly dragValue = signal(0);

  /** Computed signal that returns the current time to display (real or dragged) */
  protected readonly displayTime = computed(() => {
    return this.isDragging() ? this.dragValue() : this.webPlayer.currentTime();
  });

  /**
   * Update the visual seek bar while dragging without affecting the audio
   */
  onSeekInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.webPlayer.isSeeking.set(true);
    this.isDragging.set(true);
    this.dragValue.set(parseFloat(target.value));
  }

  /**
   * Finalize the seek operation and update the web player time
   */
  onSeekChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const time = parseFloat(target.value);
    this.webPlayer.seek(time);
    setTimeout(() => {
      this.isDragging.set(false);
      this.webPlayer.isSeeking.set(false);
    }, 50);
  }

  /**
   * Change the volume of the current track in real-time
   */
  onVolumeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.webPlayer.setVolume(parseFloat(target.value));
  }
}
