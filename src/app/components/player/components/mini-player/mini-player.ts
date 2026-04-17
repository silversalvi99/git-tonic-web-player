import { Component, computed, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroBackward,
  heroForward,
  heroPause,
  heroPlay,
  heroSpeakerWave,
  heroSpeakerXMark,
  heroArrowsPointingOut,
  heroChevronUp,
  heroArrowPath,
} from '@ng-icons/heroicons/outline';
import { WebPlayer } from '../../../../services/web-player/web-player';
import { FormatDurationPipe } from '../../../../pipes/format-duration-pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [CommonModule, FormatDurationPipe, NgIcon, TranslateModule],
  providers: [
    provideIcons({
      heroBackward,
      heroForward,
      heroPause,
      heroPlay,
      heroSpeakerWave,
      heroSpeakerXMark,
      heroArrowsPointingOut,
      heroChevronUp,
      heroArrowPath,
    }),
  ],
  templateUrl: './mini-player.html',
})
export class MiniPlayer {
  /** Web player service inject */
  protected readonly webPlayer = inject(WebPlayer);

  /** Output to notify parent to toggle open mode */
  toggleOpenMode = output<void>();

  /** Signal to store the previous volume before muting */
  private readonly lastVolume = signal(1);
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

  /**
   * Toggle mute/unmute
   */
  toggleMute(): void {
    const currentVolume = this.webPlayer.volume();
    this.webPlayer.setVolume(currentVolume > 0 ? 0 : 1);
  }
}
